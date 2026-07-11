import { pipeline, env } from '@xenova/transformers';

// Configuration
env.allowLocalModels = false;
// Use WASM backend and specify CDN path to avoid Next.js local serving issues
env.backends.onnx.wasm.numThreads = 1;
env.backends.onnx.wasm.wasmPaths = 'https://cdn.jsdelivr.net/npm/onnxruntime-web@1.17.1/dist/';

class PipelineSingleton {
    static task = 'text-generation';
    static model = 'Xenova/Qwen1.5-0.5B-Chat'; // Small, highly capable chat model
    static instance: any = null;

    static async getInstance(progress_callback: Function) {
        if (this.instance === null) {
            this.instance = pipeline(this.task as any, this.model, { 
                progress_callback 
            });
        }
        return this.instance;
    }
}

self.addEventListener('message', async (event: MessageEvent) => {
    const { type, text, context } = event.data;

    if (type === 'init') {
        try {
            self.postMessage({ status: 'init', message: 'Loading local AI model...' });
            await PipelineSingleton.getInstance((x: any) => {
                self.postMessage({ status: 'progress', data: x });
            });
            self.postMessage({ status: 'ready' });
        } catch (error) {
            self.postMessage({ status: 'error', error: String(error) });
        }
    }

    if (type === 'generate') {
        try {
            const generator = await PipelineSingleton.getInstance((x: any) => {
                // Ignore progress during generation
            });

            const prompt = `<|im_start|>system\nYou are an 8085 Assembly expert. Write clean, commented code.\nContext: ${context || 'None'}<|im_end|>\n<|im_start|>user\n${text}<|im_end|>\n<|im_start|>assistant\n`;
            
            const output = await generator(prompt, {
                max_new_tokens: 256,
                temperature: 0.2,
                do_sample: true,
            });

            const generatedText = output[0].generated_text.replace(prompt, '').trim();
            self.postMessage({ status: 'complete', output: generatedText });
        } catch (error) {
            self.postMessage({ status: 'error', error: String(error) });
        }
    }
});
