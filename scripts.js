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

    const allRadioButtons = form.querySelectorAll('input[type="radio"]');
    allRadioButtons.forEach(radio => {
        radio.addEventListener("click", () => {
            const parentGroup = radio.closest(".question-group");
            if (parentGroup) {
                parentGroup.classList.add("is-answered");
            }
        });
    });

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
   4) ระบบอนิเมชันตอนเลื่อน
---------------------------------------------------------- */
function initScrollAnimations() {
    const elementsToAnimate = document.querySelectorAll(".animate-fade-up");
    if (!elementsToAnimate.length) return;
    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("is-visible");
                } else {
                    entry.target.classList.remove("is-visible");
                }
            });
        },
        { threshold: 0.1 } 
    );
    elementsToAnimate.forEach(el => {
        observer.observe(el);
    });
}


/* ---------------------------------------------------------
   5) DMIND Slide Highlight Effect
---------------------------------------------------------- */
function addDmindSlideEffects() {
    const swiperInstance = document.querySelector(".mySwiper");
    if (!swiperInstance || !swiperInstance.swiper) {
        setTimeout(addDmindSlideEffects, 100);
        return;
    }
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
    setTimeout(() => {
        if (swiper.slides[swiper.activeIndex]) {
            const centerSlide = swiper.slides[swiper.activeIndex];
            centerSlide.style.opacity = "1";
            centerSlide.style.transform = "scale(1)";
        }
    }, 300); 
}

/* =========================================================
   6) กราฟ (AREA CHART) 
   ========================================================= */
function renderPsychiatristChart() {
    const canvas = document.getElementById("psy-chart");
    const chartSection = document.querySelector(".chart-section");

    if (!canvas || !chartSection || typeof Chart === 'undefined') return;

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

                    new Chart(ctx, {
                        type: "line",
                        data: {
                            labels: ["จิตแพทย์ไทย", "WHO แนะนำ", "WHO มาตรฐานสูงสุด"],
                            datasets: [{
                                type: "line",
                                data: [1.3, 3, 10],
                                borderColor: "#E15759", 
                                borderWidth: 3,
                                tension: 0.4,
                                fill: true,
                                backgroundColor: fillGradient, 
                                pointRadius: 7,
                                pointBackgroundColor: "#E15759", 
                                pointBorderColor: "#FFFFFF", 
                                pointBorderWidth: 2,
                                datalabels: { 
                                    display: true,
                                    color: "#333333",
                                    font: { weight: "bold", size: 16 },
                                    anchor: "end", align: "top", offset: -10,
                                    backgroundColor: 'rgba(255,255,255,0.7)', 
                                    borderRadius: 4,
                                    padding: {top:4, bottom:2, left:6, right:6},
                                    borderColor: 'rgba(225, 87, 89, 0.3)',
                                    borderWidth: 1
                                }  
                            }]
                        },
                        options: {
                            responsive: true,
                            animation: { duration: 1500, easing: "easeOutQuart" },
                            plugins: { legend: { display: false }, datalabels: { display: false } },
                            scales: {
                                y: { beginAtZero: true, ticks: { stepSize: 2 }, max: 12, grid: { color: 'rgba(0,0,0,0.08)' } },
                                x: { grid: { display: false } }
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
   7) ฟังก์ชันแผนที่ (★ โหมด Heatmap/Tooltip + จุดพิกัดจริง ★)
---------------------------------------------------------- */
    // ★ 1. ข้อมูลโรงพยาบาลพร้อมพิกัดจริง (Latitude, Longitude) และที่อยู่ ★
    // ปรับให้ใช้สีเดียวกันทั้งหมด (Theme Orange) ตามที่ user ต้องการ
    const HOSPITAL_POINTS = [
        { name: 'โรงพยาบาลสวนปรุง', province: 'เชียงใหม่', lat: 18.7761, lon: 98.9776, color: '#E65100', address: '131 ถ.ช่างหล่อ ต.หายยา อ.เมือง จ.เชียงใหม่ 50100' },
        { name: 'สถาบันพัฒนาการเด็กราชนครินทร์', province: 'เชียงใหม่', lat: 18.8494, lon: 98.9661, color: '#E65100', address: '196 หมู่ 10 ต.ดอนแก้ว อ.แม่ริม จ.เชียงใหม่ 50180' },
        { name: 'โรงพยาบาลศรีธัญญา', province: 'นนทบุรี', lat: 13.8472, lon: 100.5150, color: '#E65100', address: '47 ถ.ติวานนท์ ต.ตลาดขวัญ อ.เมือง จ.นนทบุรี 11000' },
        { name: 'สถาบันกัลยาณ์ราชนครินทร์', province: 'นครปฐม', lat: 13.7844, lon: 100.3347, color: '#E65100', address: '23 หมู่ 8 ถ.พุทธมณฑลสาย 4 ต.กระทุ่มล้ม อ.สามพราน จ.นครปฐม 73220' },
        { name: 'โรงพยาบาลสวนสราญรมย์', province: 'สุราษฎร์ธานี', lat: 9.1072, lon: 99.2972, color: '#E65100', address: '25 หมู่ 4 ต.ท่าข้าม อ.พุนพิน จ.สุราษฎร์ธานี 84130' },
        { name: 'สถาบันสุขภาพจิตเด็กและวัยรุุ่นภาคใต้', province: 'สุราษฎร์ธานี', lat: 9.1150, lon: 99.3050, color: '#E65100', address: '46 หมู่ 6 ต.ท่าข้าม อ.พุนพิน จ.สุราษฎร์ธานี 84130' },
        { name: 'โรงพยาบาลจิตเวชสงขลาราชนครินทร์', province: 'สงขลา', lat: 7.1683, lon: 100.6072, color: '#E65100', address: '386 หมู่ 4 ต.เขารูปช้าง อ.เมือง จ.สงขลา 90000' },
        { name: 'โรงพยาบาลจิตเวชเลยราชนครินทร์', province: 'เลย', lat: 17.5550, lon: 101.7261, color: '#E65100', address: '222 หมู่ 1 ต.นาอาน อ.เมือง จ.เลย 42000' },
        { name: 'โรงพยาบาลจิตเวชนครพนมราชนครินทร์', province: 'นครพนม', lat: 17.4361, lon: 104.7672, color: '#E65100', address: '210 หมู่ 11 ต.อาจสามารถ อ.เมือง จ.นครพนม 48000' },
        { name: 'โรงพยาบาลจิตเวชขอนแก่นราชนครินทร์', province: 'ขอนแก่น', lat: 16.4461, lon: 102.8361, color: '#E65100', address: '169 หมู่ 4 ถ.ชาตะผดุง ต.ในเมือง อ.เมือง จ.ขอนแก่น 40000' },
        { name: 'สถาบันสุขภาพจิตเด็กและวัยรุ่นภาคตะวันออกเฉียงเหนือ', province: 'ขอนแก่น', lat: 16.4561, lon: 102.8461, color: '#E65100', address: '86 หมู่ 14 ถ.มิตรภาพ ต.ในเมือง อ.เมือง จ.ขอนแก่น 40000' },
        { name: 'โรงพยาบาลพระศรีมหาโพธิ์', province: 'อุบลราชธานี', lat: 15.2561, lon: 104.8461, color: '#E65100', address: '212 ถ.แจ้งสนิท ต.ในเมือง อ.เมือง จ.อุบลราชธานี 34000' },
        { name: 'โรงพยาบาลจิตเวชนครราชสีนาราชครินทร์', province: 'นครราชสีมา', lat: 14.9561, lon: 102.0561, color: '#E65100', address: '86 ถ.ช้างเผือก ต.ในเมือง อ.เมือง จ.นครราชสีมา 30000' },
        { name: 'โรงพยาบาลจิตเวชสระแก้วราชนครินท์', province: 'สระแก้ว', lat: 13.7861, lon: 102.0861, color: '#E65100', address: '99 หมู่ 9 ต.วัฒนานคร อ.วัฒนานคร จ.สระแก้ว 27160' },
        { name: 'โรงพยาบาลยุวประสาทไวทโยปถัมก์', province: 'สมุทรปราการ', lat: 13.6161, lon: 100.5961, color: '#E65100', address: '61 ถ.สุขุมวิท ต.ปากน้ำ อ.เมือง จ.สมุทรปราการ 10270' },
        { name: 'สถาบันราชานุกูล', province: 'กรุงเทพมหานคร', lat: 13.7761, lon: 100.5561, color: '#E65100', address: '4737 ถ.ดินแดง แขวงดินแดง เขตดินแดง กรุงเทพฯ 10400' },
        { name: 'สถาบันสุขภาพจิตเด็กและวัยรุ่นราชนครินทร์', province: 'กรุงเทพมหานคร', lat: 13.7661, lon: 100.5361, color: '#E65100', address: '11/1 ถ.พระราม 6 แขวงพญาไท เขตพญาไท กรุงเทพฯ 10400' },
        { name: 'สถาบันจิตเวชศาสตร์สมเด็จเจ้าพระยา', province: 'กรุงเทพมหานคร', lat: 13.7311, lon: 100.5061, color: '#E65100', address: '112 ถ.สมเด็จเจ้าพระยา แขวงคลองสาน เขตคลองสาน กรุงเทพฯ 10600' }
    ];

function renderInteractiveMap() {
    const mapContainer = document.getElementById('interactive-map-container');
    const mapData = Highcharts.maps['countries/th/th-all'];
    
    // ตรวจสอบการโหลด Highcharts และ Proj4js
    if (!Highcharts || typeof Highcharts.maps === 'undefined' || !mapData || !mapContainer) {
        setTimeout(renderInteractiveMap, 200);
        return; 
    }

    // 2. ข้อมูล Mapping จังหวัดสำหรับลงสีพื้นหลัง (Region)
    // เพิ่ม enName เพื่อช่วยในการจับคู่กรณี Key ไม่ตรง
    const PROVINCE_REGIONS = [
        { 'hc-key': 'th-cm', region: 1, name: 'เชียงใหม่', enName: 'Chiang Mai' },
        { 'hc-key': 'th-ns', region: 3, name: 'นครสวรรค์', enName: 'Nakhon Sawan' },
        
        { 'hc-key': 'th-no', region: 4, name: 'นนทบุรี', enName: 'Nonthaburi' }, 
        { 'hc-key': 'th-nb', region: 4, name: 'นนทบุรี' }, 
        
        { 'hc-key': 'th-sp', region: 6, name: 'สมุทรปราการ', enName: 'Samut Prakan' }, 
        { 'hc-key': 'th-sm', region: 6, name: 'สมุทรปราการ' }, 
        
        { 'hc-key': 'th-sa', region: 6, name: 'สระแก้ว', enName: 'Sa Kaeo' },
        { 'hc-key': 'th-sk', region: 6, name: 'สระแก้ว' }, // fallback for Sa Kaeo
        
        { 'hc-key': 'th-le', region: 8, name: 'เลย', enName: 'Loei' }, 
        { 'hc-key': 'th-lo', region: 8, name: 'เลย' }, 
        
        { 'hc-key': 'th-nk', region: 8, name: 'นครพนม', enName: 'Nakhon Phanom' },
        { 'hc-key': 'th-kk', region: 7, name: 'ขอนแก่น', enName: 'Khon Kaen' },
        
        { 'hc-key': 'th-un', region: 10, name: 'อุบลราชธานี', enName: 'Ubon Ratchathani' }, 
        { 'hc-key': 'th-ub', region: 10, name: 'อุบลราชธานี' }, 
        
        { 'hc-key': 'th-nm', region: 9, name: 'นครราชสีมา', enName: 'Nakhon Ratchasima' }, 
        { 'hc-key': 'th-nr', region: 9, name: 'นครราชสีมา' }, 
        
        { 'hc-key': 'th-ur', region: 11, name: 'สุราษฎร์ธานี', enName: 'Surat Thani' }, 
        { 'hc-key': 'th-st', region: 11, name: 'สุราษฎร์ธานี' }, 
        { 'hc-key': 'th-su', region: 11, name: 'สุราษฎร์ธานี' }, 
        
        { 'hc-key': 'th-sg', region: 12, name: 'สงขลา', enName: 'Songkhla' },
        { 'hc-key': 'th-so', region: 12, name: 'สงขลา' }, 
        
        { 'hc-key': 'th-bm', region: 13, name: 'กรุงเทพมหานคร', enName: 'Bangkok Metropolis' }, 
        { 'hc-key': 'th-bk', region: 13, name: 'กรุงเทพมหานคร' }, 
        
        { 'hc-key': 'th-np', region: 5, name: 'นครปฐม', enName: 'Nakhon Pathom' }
    ];

    const regionDataMap = PROVINCE_REGIONS.reduce((acc, curr) => {
        acc[curr['hc-key']] = curr;
        return acc;
    }, {});

    // ★ สร้าง Set ของจังหวัดที่มีโรงพยาบาล ★
    const activeProvinces = new Set(HOSPITAL_POINTS.map(h => h.province));

    const provinceData = mapData.features.map(feature => {
        const key = feature.properties['hc-key'];
        let data = regionDataMap[key];
        
        // ★ Fallback: ถ้าหาด้วย Key ไม่เจอ ให้ลองหาด้วยชื่อภาษาอังกฤษ ★
        if (!data && feature.properties.name) {
            data = PROVINCE_REGIONS.find(p => 
                p.enName && feature.properties.name.includes(p.enName)
            );
        }

        const provinceName = feature.properties.name;
        
        let hasHospital = false;
        if (data && activeProvinces.has(data.name)) {
            hasHospital = true;
        }

        return {
            'hc-key': key, 
            value: hasHospital ? (data ? data.region : 0) : 0, 
            name: provinceName
        };
    });

    // 3. ชุดสีสำหรับเขตสุขภาพ
    const colorAxisColors = [
        '#d9f0a3', '#addd8e', '#ffffb3', '#bcbddc', '#31a354', '#fd8d3c', 
        '#a1dab4', '#4eb3d3', '#fb6a4a', '#b38b6d', '#fccde5', '#969696', '#800026'
    ];
    
    const customStops = [
        [0 / 14, '#eeeeee'], // 0: สีเทาอ่อนมาก (สำหรับจังหวัดที่ไม่มีโรงพยาบาล)
        [1 / 14, colorAxisColors[0]],
        [2 / 14, colorAxisColors[1]],
        [3 / 14, colorAxisColors[2]],
        [4 / 14, colorAxisColors[3]],
        [5 / 14, colorAxisColors[4]],
        [6 / 14, colorAxisColors[5]],
        [7 / 14, colorAxisColors[6]],
        [8 / 14, colorAxisColors[7]],
        [9 / 14, colorAxisColors[8]],
        [10 / 14, colorAxisColors[9]],
        [11 / 14, colorAxisColors[10]],
        [12 / 14, colorAxisColors[11]],
        [13 / 14, colorAxisColors[12]]
    ];

    Highcharts.mapChart('interactive-map-container', {
        chart: {
            map: 'countries/th/th-all',
            backgroundColor: '#FFFBF0',
            proj4: window.proj4 // เชื่อมต่อ Proj4js
        },
        title: { text: '' },
        credits: { enabled: false },
        mapNavigation: { enabled: true, buttonOptions: { verticalAlign: 'bottom' } },
        
        legend: { enabled: false },

        colorAxis: {
            min: 0, 
            max: 13,
            stops: customStops,
            marker: { enabled: false }
        },

        tooltip: {
            useHTML: true,
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            borderRadius: 10, borderWidth: 0, shadow: true,
            formatter: function() {
                if (this.series.name === 'Hospitals') {
                    // Tooltip สำหรับจุดโรงพยาบาล
                    return `
                        <div style="text-align: center; padding: 5px;">
                            <span style="font-family: Kanit; font-size: 14px; font-weight: bold; color: ${this.point.color};">
                                \u25CF ${this.point.province}
                            </span><br/>
                            <span style="font-family: Kanit; font-size: 15px; font-weight: bold; color: #333;">
                                ${this.point.name}
                            </span>
                        </div>
                    `;
                } else {
                    // Tooltip สำหรับจังหวัด
                    return `
                        <span style="font-family: Kanit; font-size: 14px; font-weight: bold;">
                            ${this.point.name}
                        </span>
                    `;
                }
            }
        },

        series: [
            {
                // Layer 1: แผนที่จังหวัด (พื้นหลัง)
                name: 'เขตสุขภาพ',
                data: provinceData,
                joinBy: ['hc-key', 'hc-key'],
                borderColor: 'rgba(255,255,255,0.6)', borderWidth: 1,
                states: { hover: { color: '#FFF9C4' } },
                dataLabels: { enabled: false },
                enableMouseTracking: true
            },
            {
                // Layer 2: จุดพิกัดโรงพยาบาล (Mappoint)
                type: 'mappoint',
                name: 'Hospitals',
                data: HOSPITAL_POINTS,
                marker: {
                    symbol: 'mapmarker', // รูปทรงหมุด
                    radius: 6,
                    lineWidth: 1,
                    lineColor: '#FFFFFF'
                },
                dataLabels: {
                    enabled: false
                },
                tooltip: {
                    headerFormat: ''
                }
            }
        ]
    });
}

/* ---------------------------------------------------------
   11) Render Hospital List
---------------------------------------------------------- */
function renderHospitalList() {
    const container = document.getElementById('hospital-list-container');
    if (!container) return;

    let html = '<h3 class="header-medium-black" style="text-align:center; margin-top:40px;">รายชื่อและที่อยู่หน่วยบริการ</h3>';
    html += '<div class="hospital-grid">';

    HOSPITAL_POINTS.forEach(h => {
        html += `
            <div class="hospital-card">
                <div class="hospital-card-header" style="background-color: ${h.color}20; border-left: 5px solid ${h.color};">
                    <h4 style="color: ${h.color};">${h.name}</h4>
                </div>
                <div class="hospital-card-body">
                    <p><strong>จังหวัด:</strong> ${h.province}</p>
                    <p class="hospital-address">${h.address}</p>
                </div>
            </div>
        `;
    });

    html += '</div>';
    container.innerHTML = html;
}


/* ---------------------------------------------------------
   8) Hotspot & Tab Logics
---------------------------------------------------------- */
function initInteractions() {
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

    const hotspotR2Arm = document.querySelector(".hotspot-r2-arm");
    const cardR2 = document.querySelector(".card-r2arm");
    
    function toggleCardR2(e) {
        e.stopPropagation();
        if (cardR2) cardR2.classList.toggle("show"); 
    }

    if (hotspotR2Arm) hotspotR2Arm.addEventListener("click", toggleCardR2);
    
    document.addEventListener("click", (event) => { 
        if (cardR2 && cardR2.classList.contains("show")) {
             const isHotspotR2Click = event.target.classList.contains('hotspot-r2-arm') || 
                                     event.target.closest('.hotspot-card.card-r2arm'); 
             if (!isHotspotR2Click) {
                 cardR2.classList.remove("show");
             }
        }
    });

    const iconState = document.getElementById("iconState");
    const iconPrivate = document.getElementById("iconPrivate");
    const contentState = document.getElementById("popupState"); 
    const contentPrivate = document.getElementById("popupPrivate"); 

    if (iconState && iconPrivate && contentState && contentPrivate) {
        
        iconState.addEventListener("click", function (e) {
            e.stopPropagation();
            iconState.classList.add("is-active");
            iconPrivate.classList.remove("is-active");
            contentState.classList.add("is-active");
            contentPrivate.classList.remove("is-active");
        });
    
        iconPrivate.addEventListener("click", function (e) {
            e.stopPropagation();
            iconState.classList.remove("is-active");
            iconPrivate.classList.add("is-active");
            contentState.classList.remove("is-active");
            contentPrivate.classList.add("is-active");
        });
    }
}

 
/* ---------------------------------------------------------
   9) ลูกเล่น Parallax & Scroll to Top
---------------------------------------------------------- */
function initParallax() {
    const heroCover = document.querySelector(".hero-cover");
    if (!heroCover) return;
    window.addEventListener("scroll", () => {
        const scrollSpeed = window.pageYOffset * 0.5;
        heroCover.style.transform = `translateY(${scrollSpeed}px)`;
    });
}

function initScrollTopButton() {
    const scrollTopBtn = document.getElementById("scrollTopBtn");
    if (!scrollTopBtn) return;
    window.addEventListener("scroll", () => {
        if (window.pageYOffset > 300) { 
            scrollTopBtn.classList.add("show");
        } else {
            scrollTopBtn.classList.remove("show");
        }
    });
    scrollTopBtn.addEventListener("click", (e) => {
        e.preventDefault();
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    });
}


/* ---------------------------------------------------------
   10) Run All Functions on Page Load
---------------------------------------------------------- */
window.addEventListener("DOMContentLoaded", () => {
    initDmindSlider();
    initScrollama();
    initThiQuiz();
    initScrollAnimations(); 
    renderPsychiatristChart();
    initInteractions(); 
    
    // เรียกใช้ฟังก์ชันแผนที่แบบรอการโหลดของ Highcharts
    renderInteractiveMap(); 
    renderHospitalList(); // ★ เรียกใช้ฟังก์ชันแสดงรายการโรงพยาบาล

    initParallax(); 
    initScrollTopButton(); 

    setTimeout(addDmindSlideEffects, 600); 
});