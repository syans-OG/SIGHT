// Global Product Database
const sightProducts = [
    // POSTERS
    {
        id: "1",
        name: "Neymar Jr",
        category: "Poster",
        price: 14.90,
        image: "asset/POSTER/POSTER1.jpg",
        description: "A striking poster of Neymar Jr. in the iconic Brazil national team kit. Printed on premium 200gsm matte paper.",
        details: ["200gsm museum-quality matte paper", "Shipped in sturdy packaging", "Frame not included"],
        sizes: ["A4", "A3", "A2"]
    },
    {
        id: "2",
        name: "Erling Haaland",
        category: "Poster",
        price: 12.90,
        image: "asset/POSTER/POSTER2.jpg",
        description: "Erling Haaland in Manchester City colors. A must-have for true Citizens.",
        details: ["200gsm museum-quality matte paper", "High-fidelity color printing", "Frame not included"],
        sizes: ["A4", "A3", "A2"]
    },
    {
        id: "3",
        name: "Cristiano Ronaldo",
        category: "Poster",
        price: 15.90,
        image: "asset/POSTER/POSTER3.jpg",
        description: "Legendary Cristiano Ronaldo celebrating in the Portugal national team kit.",
        details: ["200gsm museum-quality matte paper", "Shipped in sturdy packaging", "Frame not included"],
        sizes: ["A4", "A3", "A2"]
    },
    {
        id: "4",
        name: "Anthony Edwards",
        category: "Poster",
        price: 16.90,
        image: "asset/POSTER/POSTER4.jpg",
        description: "The stars of Team USA Basketball in action. An epic tribute to the dream team.",
        details: ["200gsm museum-quality matte paper", "Shipped in sturdy packaging", "Frame not included"],
        sizes: ["A4", "A3", "A2"]
    },
    {
        id: "5",
        name: "Giannis",
        category: "Poster",
        price: 15.90,
        image: "asset/POSTER/POSTER5.jpg",
        description: "The Greek Freak, Giannis Antetokounmpo, dominating the court in Milwaukee.",
        details: ["200gsm museum-quality matte paper", "Shipped in sturdy packaging", "Frame not included"],
        sizes: ["A4", "A3", "A2"]
    },
    {
        id: "6",
        name: "Wembanyama",
        category: "Poster",
        price: 13.90,
        image: "asset/POSTER/POSTER6.jpg",
        description: "Bring the sunshine indoors with this bright and cheerful floral composition.",
        details: ["200gsm museum-quality matte paper", "Shipped in sturdy packaging", "Frame not included"],
        sizes: ["A4", "A3", "A2"]
    },
    {
        id: "7",
        name: "Godzila",
        category: "Poster",
        price: 14.90,
        image: "asset/POSTER/POSTER7.jpg",
        description: "Inspired by classic Japanese woodblock prints, re-imagined for the modern home.",
        details: ["200gsm museum-quality matte paper", "Shipped in sturdy packaging", "Frame not included"],
        sizes: ["A4", "A3", "A2"]
    },
    {
        id: "8",
        name: "Sky Line",
        category: "Poster",
        price: 13.90,
        image: "asset/POSTER/POSTER8.jpg",
        description: "Deep sea aesthetics featuring neon colors that pop on any wall.",
        details: ["200gsm museum-quality matte paper", "Shipped in sturdy packaging", "Frame not included"],
        sizes: ["A4", "A3", "A2"]
    },
    {
        id: "9",
        name: "Aventador",
        category: "Poster",
        price: 12.90,
        image: "asset/POSTER/POSTER9.jpg",
        description: "A rustic, culinary-inspired print perfect for the kitchen or dining area.",
        details: ["200gsm museum-quality matte paper", "Shipped in sturdy packaging", "Frame not included"],
        sizes: ["A4", "A3", "A2"]
    },
    {
        id: "10",
        name: "Ferrari F40",
        category: "Poster",
        price: 15.90,
        image: "asset/POSTER/POSTER10.jpg",
        description: "A tribute to legendary automotive design and engineering.",
        details: ["200gsm museum-quality matte paper", "Shipped in sturdy packaging", "Frame not included"],
        sizes: ["A4", "A3", "A2"]
    },
    {
        id: "11",
        name: "Ferrari 512TR",
        category: "Poster",
        price: 14.90,
        image: "asset/POSTER/POSTER11.jpg",
        description: "Serene Koi fish swimming in deep indigo waters. A symbol of luck and perseverance.",
        details: ["200gsm museum-quality matte paper", "Shipped in sturdy packaging", "Frame not included"],
        sizes: ["A4", "A3", "A2"]
    },
    {
        id: "12",
        name: "Mclaren P1",
        category: "Poster",
        price: 16.90,
        image: "asset/POSTER/POSTER12.jpg",
        description: "Fierce, bold, and unapologetic. The Tiger Selection is a statement piece.",
        details: ["200gsm museum-quality matte paper", "Shipped in sturdy packaging", "Frame not included"],
        sizes: ["A4", "A3", "A2"]
    },

    // T-SHIRTS
    {
        id: "t1",
        name: "Wemby San Antonio Tee",
        category: "T-Shirt",
        price: 24.90,
        image: "asset/KAOS/KAOS1.png",
        description: "Heavy-weight tee featuring Victor Wembanyama in his San Antonio Spurs gear.",
        details: ["100% Organic Cotton", "Heavyweight 220gsm", "Boxy oversized fit", "Made in Portugal"],
        sizes: ["S", "M", "L", "XL"]
    },
    {
        id: "t2",
        name: "Anthony Edwards Tee",
        category: "T-Shirt",
        price: 25.90,
        image: "asset/KAOS/KAOS2.png",
        description: "Anthony Edwards graphic tee. Explosive style on and off the court.",
        details: ["100% Organic Cotton", "Heavyweight 220gsm", "Boxy oversized fit", "Made in Portugal"],
        sizes: ["S", "M", "L", "XL"]
    },
    {
        id: "t3",
        name: "LeBron King James Tee",
        category: "T-Shirt",
        price: 26.90,
        image: "asset/KAOS/KAOS3.png",
        description: "King James Lakers graphic applied to our premium blank t-shirts.",
        details: ["100% Organic Cotton", "Heavyweight 220gsm", "Boxy oversized fit", "Made in Portugal"],
        sizes: ["S", "M", "L", "XL"]
    },
    {
        id: "t4",
        name: "Wemby Midnight Tee",
        category: "T-Shirt",
        price: 27.90,
        image: "asset/KAOS/KAOS4.png",
        description: "Wembanyama graphic inspired by midnight streetball aesthetics.",
        details: ["100% Organic Cotton", "Heavyweight 220gsm", "Boxy oversized fit", "Made in Portugal"],
        sizes: ["S", "M", "L", "XL"]
    },
    {
        id: "t5",
        name: "Nostalgia Tee",
        category: "T-Shirt",
        price: 24.90,
        image: "asset/KAOS/KAOS5.png",
        description: "A comfortable, everyday tee with our Nostalgia graphic print.",
        details: ["100% Organic Cotton", "Heavyweight 220gsm", "Boxy oversized fit", "Made in Portugal"],
        sizes: ["S", "M", "L", "XL"]
    },
    {
        id: "t6",
        name: "Sunflower Garden Tee",
        category: "T-Shirt",
        price: 24.90,
        image: "asset/KAOS/KAOS6.png",
        description: "Bring the garden with you wherever you go. High-quality DTG printing.",
        details: ["100% Organic Cotton", "Heavyweight 220gsm", "Boxy oversized fit", "Made in Portugal"],
        sizes: ["S", "M", "L", "XL"]
    },
    {
        id: "t7",
        name: "Huku Waves Tee",
        category: "T-Shirt",
        price: 24.90,
        image: "asset/KAOS/KAOS7.png",
        description: "Classic wave graphics on our signature drop-shoulder silhouette.",
        details: ["100% Organic Cotton", "Heavyweight 220gsm", "Boxy oversized fit", "Made in Portugal"],
        sizes: ["S", "M", "L", "XL"]
    },
    {
        id: "t8",
        name: "Electric Jellyfish Tee",
        category: "T-Shirt",
        price: 24.90,
        image: "asset/KAOS/KAOS8.png",
        description: "Stand out from the crowd with this vibrant, electric graphic tee.",
        details: ["100% Organic Cotton", "Heavyweight 220gsm", "Boxy oversized fit", "Made in Portugal"],
        sizes: ["S", "M", "L", "XL"]
    },
    {
        id: "t9",
        name: "Ja Morant Memphis Tee",
        category: "T-Shirt",
        price: 25.90,
        image: "asset/KAOS/KAOS9.png",
        description: "Memphis Rising — Ja Morant graphic tee for the next generation of hoopers.",
        details: ["100% Organic Cotton", "Heavyweight 220gsm", "Boxy oversized fit", "Made in Portugal"],
        sizes: ["S", "M", "L", "XL"]
    },
    {
        id: "t10",
        name: "Shai Gilgeous Tee",
        category: "T-Shirt",
        price: 25.90,
        image: "asset/KAOS/KAOS10.png",
        description: "SGA silky smooth graphic tee. Oklahoma City's finest on heavyweight cotton.",
        details: ["100% Organic Cotton", "Heavyweight 220gsm", "Boxy oversized fit", "Made in Portugal"],
        sizes: ["S", "M", "L", "XL"]
    },
    {
        id: "t11",
        name: "Luka Doncic Tee",
        category: "T-Shirt",
        price: 26.90,
        image: "asset/KAOS/KAOS11.png",
        description: "The Slovenian wizard — Luka 77 vintage bootleg graphic on premium cotton.",
        details: ["100% Organic Cotton", "Heavyweight 220gsm", "Boxy oversized fit", "Made in Portugal"],
        sizes: ["S", "M", "L", "XL"]
    },
    {
        id: "t12",
        name: "Iverson Philadelphia Tee",
        category: "T-Shirt",
        price: 27.90,
        image: "asset/KAOS/KAOS12.png",
        description: "AI3 forever. Allen Iverson 76ers tribute tee on our signature boxy silhouette.",
        details: ["100% Organic Cotton", "Heavyweight 220gsm", "Boxy oversized fit", "Made in Portugal"],
        sizes: ["S", "M", "L", "XL"]
    }
];
