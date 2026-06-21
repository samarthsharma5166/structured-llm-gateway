import env from 'dotenv'

let loaded = false

export function loadEnv():void{
    if (loaded) return;
    env.config();
    loaded = true;
}