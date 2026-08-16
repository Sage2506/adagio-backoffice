export default function LandingPage() {
    return (
        <main className="min-h-screen w-full bg-background text-on-background font-body-md antialiased pt-20">
            <header className="fixed top-0 w-full z-50 bg-surface/95 backdrop-blur-xl border-b border-outline-variant/40">
                <div className="flex items-center justify-between px-margin-mobile md:px-margin-desktop h-20 max-w-container-max mx-auto">
                    <div className="flex items-center gap-2 text-primary font-bold cursor-pointer">
                        <img src="./Logotipo.png" alt="Adagio Logo" className="h-24 w-auto object-contain dark:hidden" />
                        <img src="./logoBlanco.png" alt="Adagio Logo" className="h-24 w-auto object-contain hidden dark:block" />
                    </div>
                    <a href="https://wa.me/+526681096194?text=Hola%21%20Me%20gustaria%20agendar%20una%20clase%20muestra%21" target="_blank" className="bg-primary text-on-primary font-label-md text-label-md px-6 py-3 rounded-full hover:bg-surface-tint duration-300 active:scale-95 transition-transform flex items-center justify-center min-h-[48px]">
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
            {/* About Section */}
            <section className="py-section-gap bg-surface" id="sobre-nosotros">
                <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
                    {/* Philosophy Header */}
                    <div className="text-center mb-16 max-w-3xl mx-auto">
                        <h2 className="font-headline-md text-headline-md text-on-background mb-6">Disciplina y elegancia, sin
                            sacrificar la alegría de la infancia.</h2>
                        <div className="w-16 h-1 bg-primary mx-auto rounded-full mb-8"></div>
                        <p className="font-body-lg text-body-lg text-on-surface-variant">
                            En Adagio, creemos que la danza es una herramienta poderosa para construir confianza. Desde
                            nuestra fundación en Culiacán en febrero de 2025, nuestra misión ha sido clara: formar
                            bailarinas técnicas y apasionadas, cuidando siempre su corazón y su mente.
                        </p>
                    </div>
                    {/* Why Trust Us Cards */}
                    <div className="mb-20">
                        <h3 className="font-headline-sm text-headline-sm text-center text-on-background mb-12">¿Por qué confiar
                            en Adagio?</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
                            <div
                                className="p-8 rounded-2xl bg-surface-container-low border border-outline-variant/20 hover:shadow-sm transition-all">
                                <div
                                    className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-6">
                                    <span className="material-symbols-outlined">favorite</span>
                                </div>
                                <h4 className="font-label-md text-label-md text-on-background text-lg mb-3">Cuidado Emocional
                                </h4>
                                <p className="font-body-md text-body-md text-on-surface-variant">Priorizamos el bienestar
                                    psicológico y la autoestima de cada alumna en un ambiente positivo.</p>
                            </div>
                            <div
                                className="p-8 rounded-2xl bg-surface-container-low border border-outline-variant/20 hover:shadow-sm transition-all">
                                <div
                                    className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-6">
                                    <span className="material-symbols-outlined">groups</span>
                                </div>
                                <h4 className="font-label-md text-label-md text-on-background text-lg mb-3">Grupos Reducidos
                                </h4>
                                <p className="font-body-md text-body-md text-on-surface-variant">Atención personalizada para
                                    asegurar que cada niña reciba la corrección y el apoyo que necesita.</p>
                            </div>
                            <div
                                className="p-8 rounded-2xl bg-surface-container-low border border-outline-variant/20 hover:shadow-sm transition-all">
                                <div
                                    className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-6">
                                    <span className="material-symbols-outlined">trending_up</span>
                                </div>
                                <h4 className="font-label-md text-label-md text-on-background text-lg mb-3">Ritmo Individual
                                </h4>
                                <p className="font-body-md text-body-md text-on-surface-variant">Respetamos el proceso de
                                    aprendizaje de cada estudiante, fomentando el progreso sin presión excesiva.</p>
                            </div>
                        </div>
                    </div>
                    {/* Director Section */}
                    <div
                        className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center bg-surface-container rounded-[2rem] overflow-hidden">
                        <div className="p-12 space-y-6">
                            <h3 className="font-headline-sm text-headline-sm text-on-surface">Conoce a nuestra Directora</h3>
                            <p className="font-body-md text-body-md text-on-surface-variant">
                                Con una visión centrada en la pedagogía moderna del ballet, nuestra directora lidera Adagio
                                con el compromiso de elevar los estándares de la danza en nuestra comunidad.
                            </p>
                            <ul className="space-y-4">
                                <li className="flex items-center gap-3 font-label-md text-label-md text-primary">
                                    <span className="material-symbols-outlined">school</span> Licenciatura en Danza
                                </li>
                                <li className="flex items-center gap-3 font-label-md text-label-md text-primary">
                                    <span className="material-symbols-outlined">verified</span> Especialista en Técnica Vaganova
                                </li>
                                <li className="flex items-center gap-3 font-label-md text-label-md text-primary">
                                    <span className="material-symbols-outlined">psychology</span> Experta en Pedagogía del
                                    Ballet
                                </li>
                            </ul>
                        </div>
                        <div className="h-[500px] relative">
                            <img alt="Directora de Adagio Academia de Danza" className="w-full h-full object-cover"
                                src="/maestraPrincipal.jpg" />
                        </div>
                    </div>
                </div>
            </section>
            {/* Nuestras Clases Section */}
            <section className="py-section-gap px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto">

                <div className="text-center mb-stack-lg">
                    <h2 className="font-headline-md text-headline-md text-primary mb-4">Nuestras Clases</h2>
                    <div className="w-16 h-1 bg-outline-variant mx-auto"></div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
                    {/* Card 1 */}
                    <div className="group relative overflow-hidden rounded-xl bg-surface-lowest border border-outline-variant shadow-soft hover:shadow-md transition-shadow duration-300">
                        <div className="h-64 overflow-hidden relative">
                            <div className="bg-cover bg-center w-full h-full group-hover:scale-105 transition-transform duration-500" data-alt="A very young child in a pink tutu sitting on the floor of a dance studio, reaching towards her toes. The lighting is soft and ethereal, emphasizing a welcoming and gentle environment. Colors focus on soft creams, pale pinks, and white, creating an elegant minimal aesthetic." style={{ backgroundImage: "url('./bailarinas-principal-baby.jpg')" }}></div>
                            <div className="absolute top-4 left-4 bg-tertiary-fixed-dim text-on-tertiary-fixed-variant font-label-md text-label-md px-3 py-1 rounded-full text-xs">3 a 7 años</div>
                        </div>
                        <div className="p-6">
                            <h3 className="font-headline-sm text-headline-sm text-on-surface">Baby Dance / Iniciación</h3>
                        </div>
                    </div>
                    {/* Card 2 */}
                    <div className="group relative overflow-hidden rounded-xl bg-surface-lowest border border-outline-variant shadow-soft hover:shadow-md transition-shadow duration-300">
                        <div className="h-64 overflow-hidden relative">
                            <div className="bg-cover bg-center w-full h-full group-hover:scale-105 transition-transform duration-500" data-alt="A group of pre-teen girls practicing ballet at a barre in a bright studio. They are wearing black leotards and pink tights. The aesthetic is clean, disciplined yet friendly, with natural light pouring in. The color palette incorporates crisp whites, blacks, and subtle warm tones." style={{ backgroundImage: "url('./bailarinas-principal-infantil.jpg')" }}></div>
                            <div className="absolute top-4 left-4 bg-tertiary-fixed-dim text-on-tertiary-fixed-variant font-label-md text-label-md px-3 py-1 rounded-full text-xs">8 a 12 años</div>
                        </div>
                        <div className="p-6">
                            <h3 className="font-headline-sm text-headline-sm text-on-surface">Infantil</h3>
                        </div>
                    </div>
                    {/* Card 3 */}
                    <div className="group relative overflow-hidden rounded-xl bg-surface-lowest border border-outline-variant shadow-soft hover:shadow-md transition-shadow duration-300">
                        <div className="h-64 overflow-hidden relative">
                            <div className="bg-cover bg-center w-full h-full group-hover:scale-105 transition-transform duration-500" data-alt="A teenage dancer striking a dramatic jazz pose in a modern dance studio. The lighting highlights the dancer's form with a slight rim light, giving an elegant and professional feel. The background is a soft greyish-cream, keeping the focus on the subject in a minimalist style." style={{ backgroundImage: "url('./bailarinas-principal-juvenil.jpg')" }}></div>
                            <div className="absolute top-4 left-4 bg-tertiary-fixed-dim text-on-tertiary-fixed-variant font-label-md text-label-md px-3 py-1 rounded-full text-xs">13+ años</div>
                        </div>
                        <div className="p-6">
                            <h3 className="font-headline-sm text-headline-sm text-on-surface">Juvenil</h3>
                        </div>
                    </div>
                </div>
            </section>
            {/* Adult Classes Section */}
            <section className="py-section-gap bg-surface-container-highest">
                <div className="px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto flex flex-col md:flex-row items-center gap-gutter">
                    <div className="space-y-8">
                        <h2 className="font-headline-md text-headline-md text-on-background">Mientras ellas bailan, tú
                            también te mueves</h2>
                        <p className="font-body-lg text-body-lg text-on-surface-variant">
                            Aprovecha el tiempo y cuida de ti. Ofrecemos clases diseñadas para adultos en horarios
                            convenientes.
                        </p>
                        <div className="space-y-6">
                            <div
                                className="flex items-start gap-4 p-4 rounded-xl bg-surface/50 border border-outline-variant/30 hover:border-primary/30 transition-colors">
                                <div
                                    className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                                    <span className="material-symbols-outlined"
                                        data-icon="self_improvement">self_improvement</span>
                                </div>
                                <div>
                                    <h4 className="font-label-md text-label-md text-on-background text-lg">Yoga</h4>
                                    <p className="font-body-md text-body-md text-on-surface-variant mt-1">Lunes a Viernes •
                                        7:00 am - 8:00 am</p>
                                </div>
                            </div>
                            <div
                                className="flex items-start gap-4 p-4 rounded-xl bg-surface/50 border border-outline-variant/30 hover:border-primary/30 transition-colors">
                                <div
                                    className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                                    <span className="material-symbols-outlined"
                                        data-icon="directions_run">directions_run</span>
                                </div>
                                <div>
                                    <h4 className="font-label-md text-label-md text-on-background text-lg">Zumba</h4>
                                    <p className="font-body-md text-body-md text-on-surface-variant mt-1">Lunes a Viernes • 8:00 am -
                                        9:00 am<br />Lunes a Viernes • 7:00 pm - 8:00 pm</p>
                                </div>
                            </div>
                        </div>
                        <a className="inline-flex items-center justify-center h-12 px-8 border-2 border-primary text-primary rounded-full font-label-md text-label-md hover:bg-primary/5 transition-all"
                            href="#contacto">
                            Únete a nuestras clases de adultos
                        </a>
                    </div>
                    <div className="w-full md:w-1/2">
                        <div className="relative rounded-2xl overflow-hidden aspect-[4/3] shadow-sm">
                            <div className="bg-cover bg-center w-full h-full" data-alt="A group of adult women taking a serene yoga class in a light-filled room. The sun shines softly through the windows, highlighting a relaxed and welcoming community atmosphere. The aesthetic is light, airy, and calming, with a color palette of soft creams, whites, and muted blush." style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAKpRkwKIitUxhC5LzRZ8-DhGLHIGnmnbiuGNo4aUSagd5Lvbdl3jC64B8dy9qDlwJDDVzXzFpiZW3RXzptrYCu_UvVk0gLw1ESXDk3Z6e6_DjjEcX1wBJLW1SksRWMAyGzbFyEQ4kUQHOkatMv5qEepyppXFr4dKAwc6uzVZ6JXgnrasuYwkbbUOs9UcULwxxQ9BHL8t0IvW5nk1-XnVdzq2mpCnIiTcUOiGAJzC8zeNqFg09u4MJz')" }}></div>
                        </div>
                    </div>
                </div>
            </section>
            {/* Redes Sociales y Ubicación */}
            <section
                className="py-section-gap max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop border-t border-outline-variant/20"
                id="contacto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter">
                    {/* Ubicación */}
                    <div>
                        <h2 className="font-headline-md text-headline-md text-on-surface mb-4">Ubicación</h2>
                        <div className="w-16 h-1 bg-primary mb-stack-md rounded-full"></div>
                        <div className="rounded-2xl overflow-hidden shadow-sm h-[300px] mb-4 bg-surface-variant">
                            <iframe className="h-full w-full" src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d25825.20499056438!2d-107.44721816154521!3d24.792306582256966!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x86bcd10000867ad3%3A0xabed286d07d78c43!2sAdagio!5e0!3m2!1sen!2smx!4v1786909249419!5m2!1sen!2smx" style={{ border: 0 }} allowFullScreen loading="lazy" referrerPolicy="strict-origin-when-cross-origin" title="Ubicación de Adagio"></iframe>
                        </div>
                        <a className="inline-flex items-center gap-2 text-primary hover:text-primary-container font-label-md transition-colors"
                            href="https://maps.app.goo.gl/je4uQ4QihD6BECpP7" target="_blank">
                            <span className="material-symbols-outlined">map</span>
                            Ver en Google Maps
                        </a>
                    </div>
                    {/* Redes Sociales y Contacto */}
                    <div>
                        <h2 className="font-headline-md text-headline-md text-on-surface mb-4">Redes Sociales</h2>
                        <div className="w-16 h-1 bg-primary mb-stack-md rounded-full"></div>
                        <div className="flex gap-stack-sm mb-stack-lg">
                            <a className="w-14 h-14 rounded-full bg-primary/10 text-primary flex items-center justify-center hover:bg-primary hover:text-on-primary transition-all shadow-sm"
                                href="https://www.instagram.com/adagio_academia_de_danza_/" target="_blank">
                                <svg aria-hidden="true" className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                    <path clip-rule="evenodd"
                                        d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
                                        fill-rule="evenodd"></path>
                                </svg>
                            </a>
                            <a className="w-14 h-14 rounded-full bg-primary/10 text-primary flex items-center justify-center hover:bg-primary hover:text-on-primary transition-all shadow-sm"
                                href="https://www.facebook.com/profile.php?id=100068073077619" target="_blank">
                                <svg aria-hidden="true" className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                    <path clip-rule="evenodd"
                                        d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                                        fill-rule="evenodd"></path>
                                </svg>
                            </a>
                            <a className="w-14 h-14 rounded-full bg-primary/10 text-primary flex items-center justify-center hover:bg-primary hover:text-on-primary transition-all shadow-sm"
                                href="https://www.tiktok.com/@adagio_academia?lang=es-419" target="_blank">
                                <svg aria-hidden="true" className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                    <path clip-rule="evenodd"
                                        d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 2.25-.97 4.54-2.67 6.13-1.69 1.58-4.08 2.45-6.43 2.22-2.35-.23-4.51-1.46-5.88-3.23-1.38-1.78-1.92-4.14-1.48-6.37.45-2.22 1.83-4.17 3.73-5.32 1.9-1.15 4.28-1.45 6.4-.82v4.21c-1.07-.36-2.28-.31-3.26.23-.98.54-1.69 1.5-1.91 2.58-.22 1.09.04 2.24.71 3.1.67.87 1.78 1.34 2.89 1.31 1.11-.02 2.18-.54 2.9-1.37.71-.83 1.05-1.96 1.01-3.09-.04-3.41-.02-6.83-.02-10.24V.02z"
                                        fill-rule="evenodd"></path>
                                </svg>
                            </a>
                        </div>
                        <h3 className="font-headline-sm text-headline-sm text-on-surface mb-4">Contáctanos</h3>
                        <ul className="space-y-stack-sm font-body-md text-body-md text-on-surface-variant">
                            <li className="flex items-center gap-3">
                                <span className="material-symbols-outlined text-[20px] text-primary"
                                    data-icon="phone">phone</span>
                                <a href="https://wa.me/+526681096194?text=Hola%21%20Me%20gustaria%20agendar%20una%20clase%20muestra" target="_blank">
                                    +52 668 109 6194
                                </a>
                            </li>
                            <li className="flex items-center gap-3">
                                <span className="material-symbols-outlined text-[20px] text-primary"
                                    data-icon="mail">mail</span>
                                <a href="mailto:adagioescueladedanza@gmail.com">
                                    adagioescueladedanza@gmail.com
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
            </section>
            {/* BottomNavBar (Mobile Only) */}
            <nav className="md:hidden bg-primary dark:bg-primary-container rounded-full w-14 h-14 fixed bottom-8 right-8 z-50 shadow-[0_8px_30px_rgba(74,68,68,0.08)] flex items-center justify-center hover:scale-110 hover:shadow-lg active:scale-90 transition-transform duration-200 cursor-pointer">
                <a href="https://wa.me/+526681096194?text=Hola%21%20Me%20gustaria%20agendar%20una%20clase%20muestra" target="_blank" className="material-symbols-outlined text-on-primary" style={{ fontVariationSettings: "'FILL' 1" }}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 0 1-.923 1.785A5.969 5.969 0 0 0 6 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337Z" />
                    </svg>

                </a>
            </nav>
            {/* Footer */}
            <footer className="w-full bg-surface-container-low border-t border-outline-variant/40 py-section-gap">
                <div className="px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-gutter mb-stack-md">
                        <div className="h-16 w-auto"><img src="https://lh3.googleusercontent.com/aida-public/AB6AXuDYQU8IP3BmAo5OHzho7xRBtUiUH1Qn2JWgeOrSnw4O1GvHbZm0ue95dqqxYl9_nEMScSdPwpmLnEiD_2DolOuMEmqvJlG7Mu09E-qJSkqGvO8wEmqSyQrNqabl63mUOtNxcvyZeF34MXsVYCAHcTYgipCN4Fqpynegouwz9zanh0zx-vpu7kqcJjEI8_qmNxbQW3irj9ksCnS4t65TgDmqMmgYieQaMKJen997LpnizJaawUB4mtR8Hd8kdWbYE2S43Q" alt="Adagio Logo" className="h-full w-auto object-contain" /></div>
                        <div className="flex gap-6">
                            {/* <a className="font-body-md text-body-md text-on-surface-variant hover:text-primary transition-colors hover:underline decoration-primary underline-offset-4 duration-200" href="#">Clases</a>
                            <a className="font-body-md text-body-md text-on-surface-variant hover:text-primary transition-colors hover:underline decoration-primary underline-offset-4 duration-200" href="#">Contacto</a>
                            <a className="font-body-md text-body-md text-on-surface-variant hover:text-primary transition-colors hover:underline decoration-primary underline-offset-4 duration-200" href="#">Privacidad</a>
                            <a className="font-body-md text-body-md text-on-surface-variant hover:text-primary transition-colors hover:underline decoration-primary underline-offset-4 duration-200" href="#">Términos</a> */}
                        </div>
                    </div>
                    <div className="text-center font-body-md text-body-md text-on-surface-variant">© 2024 Adagio. Elegance in Motion.</div>
                </div>
            </footer>
        </main>
    );
}

