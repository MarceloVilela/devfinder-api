const isProduction = process.env.NODE_ENV === 'production';

const authConfig = {
    secret: String(process.env.APP_SECRET),
    expiresIn: '7d',
    cookie: {
        name: 'devfinder_token',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7d, mesmo período do expiresIn acima
    },
};

// Mesmas opções usadas ao setar (socialLoginGithub) e ao limpar (auth/logout) o cookie —
// clearCookie só funciona se path/sameSite/secure baterem com o cookie original.
export const cookieOptions = {
    httpOnly: true,
    secure: isProduction, // local (http) precisa de secure:false, senão o browser descarta o cookie
    sameSite: (isProduction ? 'none' : 'lax') as 'none' | 'lax',
    path: '/',
};

export default authConfig;