// public/pcmWorkletProcessor.js
class PCMProcessor extends AudioWorkletProcessor {
    constructor(options) {
        super()
        this.targetSampleRate = options.processorOptions?.targetSampleRate || 16000
        this.ratio = sampleRate / this.targetSampleRate // sampleRate = global ของ AudioWorkletGlobalScope (เช่น 48000)
    }

    process(inputs) {
        const channelData = inputs[0]?.[0] // mono channel, Float32Array (-1.0 ถึง 1.0)
        if (!channelData) return true

        const outputLength = Math.floor(channelData.length / this.ratio)
        const pcm16 = new Int16Array(outputLength)

        for (let i = 0; i < outputLength; i++) {
            const srcIndex = Math.floor(i * this.ratio)
            let sample = channelData[srcIndex]
            sample = Math.max(-1, Math.min(1, sample))
            pcm16[i] = sample < 0 ? sample * 0x8000 : sample * 0x7fff
        }

        this.port.postMessage(pcm16.buffer, [pcm16.buffer])
        return true
    }
}

registerProcessor('pcm-processor', PCMProcessor)