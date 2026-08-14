export default function LandingPage() {
    return (
        <main className="w-full bg-background text-on-background font-body-md antialiased pt-20">
            <header className="fixed top-0 w-full z-50 bg-white backdrop-blur-xl shadow-sm">
                <div className="flex items-center justify-between px-margin-mobile md:px-margin-desktop h-20 max-w-container-max mx-auto">
                    <div className="flex items-center gap-2 text-primary font-bold cursor-pointer">
                        <img src="./Logotipo.png" alt="Adagio Logo" className="h-14 w-auto object-contain" />
                    </div>
                    <a href="https://wa.me/+526681096194?text=Hola%21%20Me%20gustaria%20agendar%20una%20clase%20muestra%21" target="_blank" className="bg-primary text-on-primary font-label-md text-label-md px-6 py-3 rounded-full hover:bg-surface-container-highest duration-300 active:scale-95 transition-transform flex items-center justify-center min-h-[48px]">
                        Agendar
                    </a>
                </div>
            </header>
            {/* Hero Section */}
            <section className="relative h-screen flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 w-full h-full">
                    <div className="bg-cover bg-center w-full h-full opacity-60" data-alt="A graceful young ballet dancer leaping in mid-air in a brightly lit, spacious dance studio with high windows. The aesthetic is elegant and airy, using soft natural light. The color palette is minimal with pristine whites, soft cream, and subtle hints of magenta in the dancer's attire, embodying a classic and welcoming mood." style={{ backgroundImage: "url('./bailarina-principal.jpg')" }}></div>
                    <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent"></div>
                </div>
                <div className="relative z-10 text-center max-w-container-max px-margin-mobile md:px-margin-desktop mx-auto mt-20">
                    <h1 className="font-display-lg text-display-lg-mobile md:text-display-lg text-on-background mb-6 max-w-3xl mx-auto">Descubre el talento de tu hija a través de la danza</h1>
                    <p className="font-body-lg text-body-lg text-on-surface-variant mb-10 max-w-2xl mx-auto">Clases de Ballet y Jazz para niñas y jóvenes. ¡Pregunta por nuestras clases de Yoga y Zumba para ti!</p>
                    <a href="https://wa.me/+526681096194?text=Hola%21%20Me%20gustaria%20agendar%20una%20clase%20muestra%21" target="_blank" className="bg-primary text-on-primary font-label-md text-label-md px-8 py-4 rounded-full hover:shadow-lg transition-all active:scale-95 min-h-[48px] inline-flex items-center justify-center ">
                        Agenda una clase gratis
                    </a>
                </div>
            </section>
            {/* Nuestras Clases Section */}
            <section className="py-section-gap px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto">
                <div className="text-center mb-16">
                    <h2 className="font-headline-md text-headline-md text-primary mb-4">Nuestras Clases</h2>
                    <div className="w-16 h-1 bg-outline-variant mx-auto"></div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
                    {/* Card 1 */}
                    <div className="group relative overflow-hidden rounded-xl bg-tertiary shadow-sm hover:shadow-md transition-shadow duration-300">
                        <div className="h-64 overflow-hidden relative">
                            <div className="bg-cover bg-center w-full h-full group-hover:scale-105 transition-transform duration-500" data-alt="A very young child in a pink tutu sitting on the floor of a dance studio, reaching towards her toes. The lighting is soft and ethereal, emphasizing a welcoming and gentle environment. Colors focus on soft creams, pale pinks, and white, creating an elegant minimal aesthetic." style={{ backgroundImage: "url('./bailarinas-principal-baby.jpg')" }}></div>
                            <div className="absolute top-4 left-4 bg-tertiary-fixed-dim text-on-tertiary-fixed-variant font-label-md text-label-md px-3 py-1 rounded-full text-xs">3 a 7 años</div>
                        </div>
                        <div className="p-6">
                            <h3 className="font-headline-sm text-headline-sm text-on-secondary mb-2">Baby Dance / Iniciación</h3>
                        </div>
                    </div>
                    {/* Card 2 */}
                    <div className="group relative overflow-hidden rounded-xl bg-tertiary shadow-sm hover:shadow-md transition-shadow duration-300">
                        <div className="h-64 overflow-hidden relative">
                            <div className="bg-cover bg-center w-full h-full group-hover:scale-105 transition-transform duration-500" data-alt="A group of pre-teen girls practicing ballet at a barre in a bright studio. They are wearing black leotards and pink tights. The aesthetic is clean, disciplined yet friendly, with natural light pouring in. The color palette incorporates crisp whites, blacks, and subtle warm tones." style={{ backgroundImage: "url('./bailarinas-principal-infantil.jpg')" }}></div>
                            <div className="absolute top-4 left-4 bg-tertiary-fixed-dim text-on-tertiary-fixed-variant font-label-md text-label-md px-3 py-1 rounded-full text-xs">8 a 12 años</div>
                        </div>
                        <div className="p-6">
                            <h3 className="font-headline-sm text-headline-sm text-on-secondary mb-2">Infantil</h3>
                        </div>
                    </div>
                    {/* Card 3 */}
                    <div className="group relative overflow-hidden rounded-xl bg-tertiary shadow-sm hover:shadow-md transition-shadow duration-300">
                        <div className="h-64 overflow-hidden relative">
                            <div className="bg-cover bg-center w-full h-full group-hover:scale-105 transition-transform duration-500" data-alt="A teenage dancer striking a dramatic jazz pose in a modern dance studio. The lighting highlights the dancer's form with a slight rim light, giving an elegant and professional feel. The background is a soft greyish-cream, keeping the focus on the subject in a minimalist style." style={{ backgroundImage: "url('./bailarinas-principal-juvenil.jpg')" }}></div>
                            <div className="absolute top-4 left-4 bg-tertiary-fixed-dim text-on-tertiary-fixed-variant font-label-md text-label-md px-3 py-1 rounded-full text-xs">13+ años</div>
                        </div>
                        <div className="p-6">
                            <h3 className="font-headline-sm text-headline-sm text-on-secondary mb-2">Juvenil</h3>
                        </div>
                    </div>
                </div>
            </section>
            {/* Adult Classes Section */}
            <section className="py-section-gap bg-surface-container-highest">
                <div className="px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto flex flex-col md:flex-row items-center gap-12">
                    <div className="w-full md:w-1/2">
                        <h2 className="font-headline-md text-headline-md text-primary mb-6">Mientras ellas bailan, tú también te mueves</h2>
                        <div className="space-y-4 mb-8">
                            <div className="border-b border-tertiary/20 pb-4">
                                <div className="flex justify-between items-center mb-1">
                                    <h4 className="font-label-md text-label-md text-on-surface">Yoga</h4>
                                    <span className="font-body-md text-body-md text-on-surface-variant">7:00 am - 8:00 am</span>
                                </div>
                            </div>
                            <div className="border-b border-tertiary/20 pb-4">
                                <div className="flex justify-between items-center mb-1">
                                    <h4 className="font-label-md text-label-md text-on-surface">Zumba</h4>
                                    <span className="font-body-md text-body-md text-on-surface-variant">8:00 am - 9:00 am</span>
                                </div>
                                <div className="flex justify-end mt-1">
                                    <span className="font-body-md text-body-md text-on-surface-variant">7:00 pm - 8:00 pm</span>
                                </div>
                            </div>
                        </div>
                        <button className="border border-primary text-primary font-label-md text-label-md px-6 py-3 rounded-full hover:bg-primary hover:text-on-primary transition-all active:scale-95 min-h-[48px] inline-flex items-center justify-center">
                            Únete a nuestras clases de adultos
                        </button>
                    </div>
                    <div className="w-full md:w-1/2">
                        <div className="relative rounded-2xl overflow-hidden aspect-[4/3] shadow-sm">
                            <div className="bg-cover bg-center w-full h-full" data-alt="A group of adult women taking a serene yoga class in a light-filled room. The sun shines softly through the windows, highlighting a relaxed and welcoming community atmosphere. The aesthetic is light, airy, and calming, with a color palette of soft creams, whites, and muted blush." style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAKpRkwKIitUxhC5LzRZ8-DhGLHIGnmnbiuGNo4aUSagd5Lvbdl3jC64B8dy9qDlwJDDVzXzFpiZW3RXzptrYCu_UvVk0gLw1ESXDk3Z6e6_DjjEcX1wBJLW1SksRWMAyGzbFyEQ4kUQHOkatMv5qEepyppXFr4dKAwc6uzVZ6JXgnrasuYwkbbUOs9UcULwxxQ9BHL8t0IvW5nk1-XnVdzq2mpCnIiTcUOiGAJzC8zeNqFg09u4MJz')" }}></div>
                        </div>
                    </div>
                </div>
            </section>
            {/* BottomNavBar (Mobile Only) */}
            <nav className="md:hidden bg-primary dark:bg-primary-container rounded-full w-14 h-14 fixed bottom-8 right-8 z-50 shadow-[0_8px_30px_rgba(74,68,68,0.08)] flex items-center justify-center hover:scale-110 hover:shadow-lg active:scale-90 transition-transform duration-200 cursor-pointer">
                <a href="https://wa.me/+526681096194?text=Hola%21%20Me%20gustaria%20agendar%20una%20clase%20muestra%21" target="_blank" className="material-symbols-outlined text-on-primary" style={{ fontVariationSettings: "'FILL' 1" }}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 0 1-.923 1.785A5.969 5.969 0 0 0 6 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337Z" />
                        </svg>

                </a>
            </nav>
            {/* Footer */}
            <footer className="w-full bg-surface-container border-t border-tertiary/20 py-section-gap">
                <div className="px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-gutter mb-8">
                        <div className="h-16 w-auto"><img src="https://lh3.googleusercontent.com/aida-public/AB6AXuDYQU8IP3BmAo5OHzho7xRBtUiUH1Qn2JWgeOrSnw4O1GvHbZm0ue95dqqxYl9_nEMScSdPwpmLnEiD_2DolOuMEmqvJlG7Mu09E-qJSkqGvO8wEmqSyQrNqabl63mUOtNxcvyZeF34MXsVYCAHcTYgipCN4Fqpynegouwz9zanh0zx-vpu7kqcJjEI8_qmNxbQW3irj9ksCnS4t65TgDmqMmgYieQaMKJen997LpnizJaawUB4mtR8Hd8kdWbYE2S43Q" alt="Adagio Logo" className="h-full w-auto object-contain" /></div>
                        <div className="flex gap-6">
                            <a className="font-body-md text-body-md text-on-surface-variant hover:text-primary transition-colors hover:underline decoration-primary underline-offset-4 duration-200" href="#">Clases</a>
                            <a className="font-body-md text-body-md text-on-surface-variant hover:text-primary transition-colors hover:underline decoration-primary underline-offset-4 duration-200" href="#">Contacto</a>
                            <a className="font-body-md text-body-md text-on-surface-variant hover:text-primary transition-colors hover:underline decoration-primary underline-offset-4 duration-200" href="#">Privacidad</a>
                            <a className="font-body-md text-body-md text-on-surface-variant hover:text-primary transition-colors hover:underline decoration-primary underline-offset-4 duration-200" href="#">Términos</a>
                        </div>
                    </div>
                    <div className="text-center font-body-md text-body-md text-on-surface-variant">© 2024 Adagio. Elegance in Motion.</div>
                </div>
            </footer>
        </main>
    );
}

