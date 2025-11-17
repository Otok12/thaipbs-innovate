/* ---------------------------------------------------------
   1) DMIND Slider (SwiperJS) — Coverflow
---------------------------------------------------------- */
function initDmindSlider() {
    new Swiper(".mySwiper", {
        effect: "coverflow",
        grabCursor: true,
        centeredSlides: true,
        slidesPerView: "auto",
        loop: false,
        initialSlide: 2,

        coverflowEffect: {
            rotate: 0,
            stretch: -20,
            depth: 260,
            modifier: 1.3,
            slideShadows: false,
        },

        navigation: {
            nextEl: ".swiper-button-next",
            prevEl: ".swiper-button-prev",
        }
    });
}

/* ---------------------------------------------------------
   2) Scrollama (Scrollytelling)
---------------------------------------------------------- */
function initScrollama() {
    const scroller = scrollama();

    scroller
        .setup({
            step: ".step",
            offset: 0.5,
            debug: false
        })
        .onStepEnter(response => {
            document.querySelectorAll(".step")
                .forEach(el => el.classList.remove("is-active"));

            response.element.classList.add("is-active");
        });

    // ตรวจสอบว่ามี step แรกหรือไม่ ก่อนเพิ่มคลาส
    const firstStep = document.querySelector('.step[data-step="1"]');
    if (firstStep) {
        firstStep.classList.add("is-active");
    }
}

/* ---------------------------------------------------------
   3) แบบทดสอบ THI
---------------------------------------------------------- */
function initThiQuiz() {
    const form = document.getElementById("thi-form");
    if (!form) return; 

    const resultDiv = document.getElementById("quiz-result");
    const scoringKeyDiv = document.getElementById("quiz-scoring-key");

    form.addEventListener("submit", function(event) {
        event.preventDefault();

        let totalScore = 0;
        let unanswered = false;

        document.querySelectorAll(".question-group").forEach(group => {
            group.style.borderBottom = "1px solid rgba(0,0,0,0.1)"; 
        });

        if (resultDiv) resultDiv.innerHTML = "";
        if (scoringKeyDiv) scoringKeyDiv.style.display = "none";

        for (let i = 1; i <= 15; i++) {
            const selected = form.querySelector(`input[name="q${i}"]:checked`);
            if (selected) {
                totalScore += parseInt(selected.value);
            } else {
                const groupEl = document.getElementById(`q${i}-group`);
                if (groupEl) {
                    groupEl.style.borderBottom = "3px solid #c0392b";
                }
                unanswered = true;
            }
        }

        if (unanswered) {
            if (resultDiv) {
                resultDiv.innerHTML =
                    '<p class="result-error">กรุณาตอบคำถามให้ครบทุกข้อ</p>';
            }
            return;
        }

        let resultText = "";
        let resultColor = "#FF9800"; 

        if (totalScore >= 33) {
            resultText = "มีความสุขมากกว่าคนทั่วไป (Good)";
            resultColor = "#27ae60"; 
        } else if (totalScore >= 27) {
            resultText = "มีความสุขเท่ากับคนทั่วไป (Fair)";
        } else {
            resultText = "มีความสุขน้อยกว่าคนทั่วไป (Poor)";
            resultColor = "#c0392b"; 
        }

        if (resultDiv) {
            resultDiv.innerHTML = `
                <p class="result-score">คะแนนรวมของคุณคือ: ${totalScore} / 45</p>
                <p class="result-text" style="color:${resultColor};">${resultText}</p>
            `;
        }

        if (scoringKeyDiv) {
            scoringKeyDiv.style.display = "block";
        }
    });
}


/* ---------------------------------------------------------
   4) ระบบอนิเมชันตอนเลื่อน (Fade Up Animation System) - (เข้า/ออก)
---------------------------------------------------------- */
function initScrollAnimations() {
    
    // เลือกทุกส่วนที่มีคลาส .animate-fade-up
    const elementsToAnimate = document.querySelectorAll(".animate-fade-up");

    if (!elementsToAnimate.length) return;

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // เมื่อเลื่อนมาถึง ให้ "เฟดเข้า"
                    entry.target.classList.add("is-visible");
                } else {
                    // เมื่อเลื่อนผ่านไปแล้ว ให้ "เฟดออก"
                    entry.target.classList.remove("is-visible");
                }
            });
        },
        { 
            threshold: 0.1 
        } 
    );

    // สั่งให้ Observer เริ่มสังเกตทุกส่วน
    elementsToAnimate.forEach(el => {
        observer.observe(el);
    });
}


/* ---------------------------------------------------------
   5) DMIND Slide Highlight Effect
---------------------------------------------------------- */
function addDmindSlideEffects() {
    const swiperInstance = document.querySelector(".mySwiper");
    if (!swiperInstance || !swiperInstance.swiper) return;

    const swiper = swiperInstance.swiper;

    swiper.on('slideChangeTransitionStart', () => {
        swiper.slides.forEach(slide => {
            slide.style.transition = "0.35s";
            slide.style.opacity = "0.4";
            slide.style.transform = "scale(0.85)";
        });

        if (swiper.slides[swiper.activeIndex]) {
            const centerSlide = swiper.slides[swiper.activeIndex];
            centerSlide.style.opacity = "1";
            centerSlide.style.transform = "scale(1)";
        }
    });

    // ตั้งค่าสไลด์เริ่มต้นให้ชัดเจน
    setTimeout(() => {
        if (swiper.slides[swiper.activeIndex]) {
            const centerSlide = swiper.slides[swiper.activeIndex];
            centerSlide.style.opacity = "1";
            centerSlide.style.transform = "scale(1)";
        }
    }, 300); 
}

/* ---------------------------------------------------------
   6) กราฟ (AREA CHART) - เวอร์ชันแก้ไข พร้อมอนิเมชัน "วาดเส้น"
---------------------------------------------------------- */
function renderPsychiatristChart() {
    const canvas = document.getElementById("psy-chart");
    const chartSection = document.querySelector(".chart-section");

    if (!canvas || !chartSection) return;

    let chartRendered = false;

    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !chartRendered) {
                chartRendered = true; 

                setTimeout(() => {
                    const ctx = canvas.getContext("2d");

                    const fillGradient = ctx.createLinearGradient(0, 0, 0, 400);
                    fillGradient.addColorStop(0, "rgba(225, 87, 89, 0.6)"); 
                    fillGradient.addColorStop(1, "rgba(225, 87, 89, 0.05)"); 

                    const draw = (chart, easing) => {
                        const {ctx, chartArea: {top, bottom, left, right, width, height}} = chart;
                        const {datasets} = chart.data;
                        ctx.save();
                        datasets[0].backgroundColor = `rgba(225, 87, 89, ${0.05 + easing * 0.55})`;
                        datasets[0].borderColor = `rgba(225, 87, 89, ${easing})`;
                        datasets[0].pointBackgroundColor = `rgba(225, 87, 89, ${easing})`;
                        datasets[0].pointBorderColor = `rgba(255, 255, 255, ${easing})`;
                        ctx.restore();
                    }

                    new Chart(ctx, {
                        type: "line",
                        data: {
                            labels: ["จิตแพทย์ไทย", "WHO แนะนำ", "WHO มาตรฐานสูงสุด"],
                            datasets: [
                                {
                                    type: "line",
                                    data: [1.3, 3, 10],
                                    borderColor: "rgba(225, 87, 89, 0)", 
                                    borderWidth: 3,
                                    tension: 0.4,
                                    fill: true,
                                    backgroundColor: "rgba(225, 87, 89, 0)", 
                                    pointRadius: 7,
                                    pointBackgroundColor: "rgba(225, 87, 89, 0)", 
                                    pointBorderColor: "rgba(255, 255, 255, 0)", 
                                    pointBorderWidth: 2,
                                    datalabels: { 
                                        display: true,
                                        color: "#333333",
                                        font: { weight: "bold", size: 16 },
                                        anchor: "end",
                                        align: "top",
                                        offset: -10,
                                        backgroundColor: 'rgba(255,255,255,0.7)', 
                                        borderRadius: 4,
                                        padding: {top:4, bottom:2, left:6, right:6},
                                        borderColor: 'rgba(225, 87, 89, 0.3)',
                                        borderWidth: 1
                                    }  
                                }
                            ]
                        },
                        options: {
                            responsive: true,
                            animation: {
                                delay: (context) => { 
                                    let delay = 0;
                                    if (context.type === 'data' && context.mode === 'default' && !context.original.skipped) {
                                        delay = context.dataIndex * 300; 
                                    }
                                    return delay;
                                },
                                duration: 1800, 
                                easing: "easeOutQuart",
                                onProgress: (chart) => { 
                                    draw(chart.chart, chart.currentStep / chart.numSteps);
                                },
                                onComplete: (chart) => { 
                                    const {datasets} = chart.chart.data;
                                    datasets[0].backgroundColor = fillGradient; 
                                    datasets[0].borderColor = "#E15759";
                                    datasets[0].pointBackgroundColor = "#E15759";
                                    datasets[0].pointBorderColor = "#FFFFFF";
                                }
                            },
                            plugins: {
                                legend: { display: false },
                                datalabels: { display: false }
                            },
                            scales: {
                                y: {
                                    beginAtZero: true,
                                    ticks: { stepSize: 2 },
                                    max: 12, 
                                    grid: { color: 'rgba(0,0,0,0.08)' }
                                },
                                x: {
                                    grid: { display: false }
                                }
                            }
                        },
                        plugins: [ChartDataLabels]
                    });

                }, 300); 
            }
        });
    }, { threshold: 0.1 }); 

    observer.observe(chartSection);
}

/* ---------------------------------------------------------
   7) ฟังก์ชันแผนที่
---------------------------------------------------------- */
function renderInteractiveMap() {
    const mapContainer = document.getElementById('interactive-map-container');
    if (!mapContainer) return;

    // ... (ข้อมูล data เหมือนเดิม) ...
    const hospitalData_State = [
        { name: 'รพ.จิตเวชขอนแก่นฯ', lat: 16.4866, lon: 102.8346 },
        { name: 'รพ.ศรีธัญญา', lat: 13.8462, lon: 100.5169 }
    ];
    const hospitalData_Private = [
        { name: 'รพ.กรุงเทพ', lat: 13.7487, lon: 100.5834 },
        { name: 'รพ.สมิติเวช ศรีนครินทร์', lat: 13.7488, lon: 100.6383 }
    ];

    Highcharts.mapChart('interactive-map-container', {
        chart: {
            map: 'countries/th/th-all',
            backgroundColor: '#FFFBF0' 
        },
        title: {
            text: '' 
        },
        credits: {
            enabled: false 
        },
        
        accessibility: {
            enabled: false
        },
        
        mapNavigation: {
            enabled: false, 
        },
        
        tooltip: { 
            enabled: false 
        },
        
        legend: {
             enabled: false 
        },

        series: [
        {
            // Series 1: แผนที่ฐาน
            mapData: Highcharts.maps['countries/th/th-all'],
            data: [],
            name: 'แผนที่ประเทศไทย',
            joinBy: 'name', 
            states: {
                hover: { enabled: false }
            },
            dataLabels: { enabled: false },
            nullColor: 'rgba(0, 0, 0, 0.05)', 
            enableMouseTracking: false 
        },
        {
            // Series 2: รพ.รัฐ
            type: 'mappoint',
            name: 'โรงพยาบาลรัฐ',
            data: hospitalData_State,
            color: '#FF4B4B', 
            marker: {
                symbol: 'circle',
                radius: 8,
                lineWidth: 2,
                lineColor: 'white'
            },
            dataLabels: {
                enabled: true,
                format: '{point.name}', 
                style: {
                    fontFamily: 'Kanit, sans-serif',
                    fontWeight: 'bold',
                    color: '#333333',
                    fontSize: '11px'
                },
                y: -20 
            }
        },
        {
            // Series 3: รพ.เอกชน
            type: 'mappoint',
            name: 'โรงพยาบาลเอกชน',
            data: hospitalData_Private,
            color: '#FF9800', 
            marker: {
                symbol: 'circle',
                radius: 8,
                lineWidth: 2,
                lineColor: 'white'
            },
             dataLabels: {
                enabled: true,
                format: '{point.name}', 
                style: {
                    fontFamily: 'Kanit, sans-serif',
                    fontWeight: 'bold',
                    color: '#333333',
                    fontSize: '11px'
                },
                y: -20 
            }
        }]
    });
}


/* ---------------------------------------------------------
   8) Hotspot & Tab Logics (แก้ไข Hotspot R2)
---------------------------------------------------------- */
function initInteractions() {
    
    // --- Hotspot R1 (2 จุด) ---
    const hotspotLeft = document.querySelector(".hotspot-left");
    const hotspotRight = document.querySelector(".hotspot-right");
    const cardLeft = document.querySelector(".card-left");
    const cardRight = document.querySelector(".card-right");

    if (hotspotLeft && cardLeft) {
        hotspotLeft.addEventListener("click", (e) => {
            e.stopPropagation();
            cardLeft.classList.toggle("show");
            if (cardRight) cardRight.classList.remove("show");
        });
    }

    if (hotspotRight && cardRight) {
        hotspotRight.addEventListener("click", (e) => {
            e.stopPropagation();
            cardRight.classList.toggle("show");
            if (cardLeft) cardLeft.classList.remove("show");
        });
    }

    // --- Hotspot R2 (เก้าอี้) - ใช้คลาส .show และเหลือจุดเดียว ★ ---
    const hotspotR2Arm = document.querySelector(".hotspot-r2-arm");
    const cardR2 = document.querySelector(".card-r2arm");
    
    // สร้างฟังก์ชันคลิกที่ใช้ร่วมกัน
    function toggleCardR2(e) {
        e.stopPropagation();
        if (cardR2) cardR2.classList.toggle("show"); 
    }

    if (hotspotR2Arm) hotspotR2Arm.addEventListener("click", toggleCardR2);
    
    // คลิกที่อื่นให้ซ่อนกล่องข้อความ
    document.addEventListener("click", (event) => { 
        if (cardR2 && cardR2.classList.contains("show")) {
             // เช็คว่าไม่ได้คลิกที่ Hotspot R2 หรือ cardR2 ก่อนปิด
             const isHotspotR2Click = event.target.classList.contains('hotspot-r2-arm') || 
                                      event.target.closest('.hotspot-card.card-r2arm'); 
             if (!isHotspotR2Click) {
                 cardR2.classList.remove("show");
             }
        }
    });


    // --- Hospital Tabs (ระบบแท็บ รพ.) ---
    const iconState = document.getElementById("iconState");
    const iconPrivate = document.getElementById("iconPrivate");
    const contentState = document.getElementById("popupState"); 
    const contentPrivate = document.getElementById("popupPrivate"); 

    if (iconState && iconPrivate && contentState && contentPrivate) {
        
        iconState.addEventListener("click", function (e) {
            e.stopPropagation();
            // สลับไอคอน Active
            iconState.classList.add("is-active");
            iconPrivate.classList.remove("is-active");
            
            // สลับเนื้อหา Active
            contentState.classList.add("is-active");
            contentPrivate.classList.remove("is-active");
        });
    
        iconPrivate.addEventListener("click", function (e) {
            e.stopPropagation();
            // สลับไอคอน Active
            iconState.classList.remove("is-active");
            iconPrivate.classList.add("is-active");
            
            // สลับเนื้อหา Active
            contentState.classList.remove("is-active");
            contentPrivate.classList.add("is-active");
        });
    }
}


/* ---------------------------------------------------------
   9) Run All Functions on Page Load
---------------------------------------------------------- */
window.addEventListener("DOMContentLoaded", () => {
    initDmindSlider();
    initScrollama();
    initThiQuiz();
    initScrollAnimations(); 
    renderPsychiatristChart();
    initInteractions(); 
    renderInteractiveMap(); 

    setTimeout(addDmindSlideEffects, 600); 
});