import { useRef, useState } from "react"

export const usePronunciationRecorder = () => {
    const [isRecording, setIsRecording] = useState(false)
    const audioContextRef = useRef(null)
    const workletNodeRef = useRef(null)
    const sourceRef = useRef(null)
    const silentGainRef = useRef(null)
    const streamRef = useRef(null)

    const startRecording = async (onAudioChunk) => {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
        streamRef.current = stream

        const audioContext = new AudioContext()
        audioContextRef.current = audioContext

        await audioContext.audioWorklet.addModule('/pcmWorkletProcessor.js')

        const source = audioContext.createMediaStreamSource(stream)
        sourceRef.current = source

        const workletNode = new AudioWorkletNode(audioContext, 'pcm-processor', {
            processorOptions: { targetSampleRate: 16000 }
        })
        workletNodeRef.current = workletNode

        workletNode.port.onmessage = (event) => {
            // event.data คือ ArrayBuffer ของ Int16 PCM ส่งตรงไป ws.send() ได้เลย (ไม่ต้อง base64 ฝั่ง frontend)
            onAudioChunk(event.data)
        }

        source.connect(workletNode)

        // บาง browser ต้อง connect ไป destination ไม่งั้น worklet จะไม่ process
        // ใช้ gain = 0 กันไม่ให้ผู้เล่นได้ยินเสียงตัวเองสะท้อนกลับ (echo)
        const silentGain = audioContext.createGain()
        silentGain.gain.value = 0
        silentGainRef.current = silentGain
        workletNode.connect(silentGain)
        silentGain.connect(audioContext.destination)

        setIsRecording(true)
    }

    const stopRecording = () => {
        workletNodeRef.current?.disconnect()
        sourceRef.current?.disconnect()
        silentGainRef.current?.disconnect()
        audioContextRef.current?.close()
        streamRef.current?.getTracks().forEach(t => t.stop())
        setIsRecording(false)
    }

    return { isRecording, startRecording, stopRecording }
}