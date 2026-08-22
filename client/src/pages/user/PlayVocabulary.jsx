import { useEffect, useState } from "react";
import { useFetch } from "../../hook/useFetch";
import { list } from "../../api/vocabulary";
import { usePronunciationRecorder } from "../../hook/usePronunciationRecorder";
import { usePronunciationSocket } from "../../hook/usePronunciationSocket";
import { useNavigate, useParams } from "react-router";
import LoadingPlay from "../../components/playvocabulary/LoadingPlay";
import CardVocabulary from "../../components/card/CardVocabulary";
import Button from "../../components/ui/Button";
import ResultSummary from "../../components/playvocabulary/ResultSummary";
import { GrHomeRounded } from "react-icons/gr";
import { save, playAgain } from "../../api/deck";
import toast from "react-hot-toast";

const PlayVocabulary = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const [progress, setProgress] = useState(0)
    const [preLoading, setPreLoading] = useState(true)
    const { data, handleGetData } = useFetch(list)
    const [currentIndex, setCurrentIndex] = useState(0)
    const socket = usePronunciationSocket({
        onNextWord: () => {
            setCurrentIndex(prev => prev + 1);
        }
    })
    const recorder = usePronunciationRecorder()

    const currentVocab = data?.[currentIndex]
    const hasNoVocab = !preLoading && data?.length === 0
    const isFinished = !preLoading && data?.length > 0 && currentIndex >= data.length

    useEffect(() => {
        let cancelled = false
        let fastInterval

        playAgain(id)

        fastInterval = setInterval(() => {
            setProgress(val => {
                if (val >= 70) {
                    clearInterval(fastInterval)
                    return val
                }
                return val + 10
            })
        }, 2000)

        const fetchVocabTask = handleGetData(id)
        const tasks = [fetchVocabTask]
        let completed = 0

        tasks.forEach(task => {
            Promise.resolve(task)
                .catch(err => console.error("Task failed:", err))
                .finally(() => {
                    if (cancelled) return
                    completed += 1
                    const realProgress = 70 + Math.round((completed / tasks.length) * 30)
                    setProgress(val => Math.max(val, realProgress))
                })
        })

        Promise.allSettled(tasks).then(() => {
            if (cancelled) return
            setProgress(100)
            setTimeout(() => {
                if (!cancelled) setPreLoading(false)
            }, 700)
        })

        return () => {
            cancelled = true
            clearInterval(fastInterval)
        }
    }, [id])

    useEffect(() => {
        if (!isFinished) return

        save(id).catch(err => {
            console.log('บันทึกคะแนนไม่สำเร็จ', err)
            toast.error('บันทึกคะแนนไม่สำเร็จ')
        })

    }, [isFinished, id])

    const handleStartSpeaking = async () => {
        if (!currentVocab) return
        try {
            await socket.connect(currentVocab.id) // resolve เมื่อ backend พร้อม (status: "ready")
            await recorder.startRecording((chunk) => {
                socket.sendChunk(chunk)
            })
        } catch (err) {
            console.error("Failed to start pronunciation session:", err)
        }
    }

    const handleStopSpeaking = () => {
        recorder.stopRecording()
        socket.sendStop() // บอก backend ว่าเสียงจบแล้ว ให้ iFlytek คำนวณผล
        // ปิด connection ทีหลังหลังได้ผลลัพธ์แล้ว หรือหลัง timeout สั้นๆ
        setTimeout(() => socket.disconnect(), 3000)
    }

    const handlePlayAgain = async () => {
        setCurrentIndex(0)
        socket.resetPoint()
        await playAgain(id)
    }

    return (
        <div className="bg-neutral h-screen flex justify-center items-center font-itim">
            < div className="flex flex-col items-center">
                {preLoading ? (
                    <LoadingPlay progress={progress} />
                ) : hasNoVocab ? (
                    <div className="flex flex-col items-center gap-3">
                        <p>ไม่พบคำศัพท์ในชุดนี้</p>
                        <button type="button" onClick={() => navigate(`/user/deck/${id}/vocabulary`)} className="flex justify-center items-center w-20 rounded-md p-2 bg-red-400"><GrHomeRounded className="size-5 text-white" /></button>
                    </div>
                ) : isFinished ? (
                    <ResultSummary
                        point={socket.point}
                        total={data.length * 100}
                        onPlayAgain={handlePlayAgain}
                        onBackToList={() => navigate(`/user/deck/${id}/vocabulary`)}
                    />
                ) : (
                    <div className="space-y-5 text-center">
                        <div className="flex justify-between items-baseline-last">
                            <div className="flex items-baseline-last gap-3">
                                <p className="text-3xl font-bold text-secondary">{socket.result ? socket.result.overall.totalScore.toFixed(2) : '0'}</p>
                                <p className="text-sm text-stone-400">แต้ม</p>
                                <div className="flex justify-center gap-4 text-sm text-stone-400">
                                    <span>เสียง: {socket.result ? socket.result.overall.phoneScore.toFixed(2) : '0'}</span>
                                    <span>วรรณยุกต์: {socket.result ? socket.result.overall.toneScore.toFixed(2) : '0'}</span>
                                </div>
                                {socket.result && (
                                    socket.result.words[0]?.syllables.map((syll, i) => (
                                        <span
                                            key={i}
                                            className={`px-2 py-1 rounded ${syll.hasError ? 'bg-red-100 text-red-500' : 'bg-green-100 text-green-600'}`}
                                        >
                                            {syll.content}
                                        </span>
                                    ))
                                )}
                            </div>
                            <h1 className="text-stone-400">คะแนนรวม <span className="font-bold text-2xl text-green-500">{socket.point} / {data.length * 100}</span> แต้ม</h1>
                        </div>
                        <CardVocabulary
                            image={currentVocab.url}
                            word={currentVocab.word}
                            pinyin={currentVocab.pinyin}
                            answer={currentVocab.meaning}
                            flip={socket.flip}
                        />
                        {!recorder.isRecording ? (
                            <Button
                                type="button"
                                onClick={handleStartSpeaking}
                                children="เริ่มพูด"
                                variant="secondary"
                                width="w-fit"
                            />
                        ) : (
                            <Button
                                type="button"
                                onClick={handleStopSpeaking}
                                children="หยุด"
                                variant="primary"
                                width="w-fit"
                            />
                        )}
                        <div className="flex justify-center gap-5">
                            <p className="text-sm text-stone-400">สถานะ: {socket.status}</p>
                            <p className="text-sm text-stone-400">คำที่ {currentIndex + 1} จาก {data.length} คำศัพท์</p>
                        </div>
                        {socket.error && <p className="text-sm text-red-500">{socket.error}</p>}
                    </div>
                )}
            </div >
        </div>
    )
}
export default PlayVocabulary