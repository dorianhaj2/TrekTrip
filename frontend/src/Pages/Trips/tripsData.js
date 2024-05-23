const tripsData = [
    {
        id: 1,
        image: 'example.jpg',
        title: 'Example Trip 1',
        author: 'John Doe',
        rating: 4.5,
        details: [
            {
                day: 1,
                title: 'Day 1: Arrival',
                description: 'Description of day 1...',
            },
            {
                day: 2,
                title: 'Day 2: Exploration',
                description: 'Description of day 2...',
            },
            // Add more details as needed
        ],
        summary: {
            country: 'Exampleland',
            destination: 'Example City',
            month: 'January',
            duration: '5 days',
            price: '$$$',
        },
        comments: [
            {
                author: 'Alice',
                text: 'Great trip! Highly recommended.',
            },
            {
                author: 'Bob',
                text: 'Had an amazing experience.',
            },
            // Add more comments as needed
        ],
        description: 'Zadivljujuće putovanje kroz raznolike krajolike i bogatu kulturu Kanarskih otoka, spajanje avanture, opuštanja i otkrića u nezaboravno iskustvo.',
    },
    {
        id: 2,
        image: 'mountain.jpg',
        title: 'Mountain Expedition 2',
        author: 'Jane Smith',
        rating: 4.8,
        details: [
            {
                day: 1,
                title: 'Day 1: Base Camp Setup',
                description: 'Arrive at the base camp and set up tents. Orientation and safety briefing.',
            },
            {
                day: 2,
                title: 'Day 2: Hiking to Summit',
                description: 'Start early morning hike to the summit. Enjoy breathtaking views along the way.',
            },
            {
                day: 3,
                title: 'Day 3: Summit and Descent',
                description: 'Reach the summit, take photos, and start the descent back to base camp.',
            },
            // Add more details as needed
        ],
        summary: {
            country: 'Nepal',
            destination: 'Himalayas',
            month: 'April',
            duration: '3 days',
            price: '$$$',
        },
        comments: [
            {
                author: 'Chris',
                text: 'Unforgettable experience! The views were spectacular.',
            },
            {
                author: 'Emily',
                text: 'Challenging but rewarding trek. Would do it again!',
            },
            // Add more comments as needed
        ],
        description: 'Mistična citadela Inka smještena usred planina Anda, obavijena maglom i misterijom, mami avanturiste da otkriju njene drevne tajne i dive se njenoj ljepoti koja oduzima dah.',
    },
    {
        id: 3,
        image: 'kyoto.jpg',
        title: 'Kyoto, Japan 3',
        author: 'Alice Johnson',
        rating: 4.7,
        details: [
            {
                day: 1,
                title: 'Day 1: Arrival in Kyoto',
                description: 'Arrive in Kyoto and check-in to your accommodation.',
            },
            {
                day: 2,
                title: 'Day 2: Explore Temples',
                description: 'Visit famous temples and shrines in Kyoto.',
            },
            {
                day: 3,
                title: 'Day 3: Arashiyama Bamboo Grove',
                description: 'Explore the stunning Arashiyama Bamboo Grove.',
            },
            // Add more details as needed
        ],
        summary: {
            country: 'Japan',
            destination: 'Kyoto',
            month: 'May',
            duration: '4 days',
            price: '$$$',
        },
        comments: [
            {
                author: 'David',
                text: 'Kyoto is amazing! The temples are so peaceful.',
            },
            {
                author: 'Sophia',
                text: 'The bamboo grove is a must-visit! It\'s like stepping into another world.',
            },
            // Add more comments as needed
        ],
        description: 'Gdje trešnjini cvjetovi plešu u proljeće, gejše krase drevne ulice, a stoljećima stari hramovi šapuću priče o prošlim vremenima, nudeći bezvremeno putovanje u japansku kulturu i povijest.',
    },
    {
        id: 4,
        image: 'maldivi.jpg',
        title: 'Maldives 4',
        author: 'Michael Smith',
        rating: 4.9,
        details: [
            {
                day: 1,
                title: 'Day 1: Arrival in Paradise',
                description: 'Arrive in the Maldives and transfer to your overwater bungalow.',
            },
            {
                day: 2,
                title: 'Day 2: Snorkeling Adventure',
                description: 'Embark on a snorkeling adventure to explore vibrant coral reefs.',
            },
            {
                day: 3,
                title: 'Day 3: Relaxation Day',
                description: 'Indulge in a day of relaxation on pristine white-sand beaches.',
            },
            // Add more details as needed
        ],
        summary: {
            country: 'Maldives',
            destination: 'Malé',
            month: 'June',
            duration: '5 days',
            price: '$$$',
        },
        comments: [
            {
                author: 'Emma',
                text: 'The Maldives exceeded all my expectations. It\'s truly a paradise on earth.',
            },
            {
                author: 'James',
                text: 'The water villas are incredible! Waking up to the sound of waves was magical.',
            },
            // Add more comments as needed
        ],
        description: 'Raj netaknutih bijelih pješčanih plaža, kristalno čisto tirkiznog mora i luksuznih bungalova iznad vode, stvarajući idilično mjesto za opuštanje i romantiku.',
    },
    {
        id: 5,
        image: 'amalfi.jpg',
        title: 'Amalfi Coast 5',
        author: 'Sophia Williams',
        rating: 4.6,
        details: [
            {
                day: 1,
                title: 'Day 1: Arrival in Amalfi',
                description: 'Arrive in Amalfi and check-in to your charming hotel.',
            },
            {
                day: 2,
                title: 'Day 2: Coastal Drive',
                description: 'Embark on a scenic coastal drive along the Amalfi Coast, stopping at picturesque villages along the way.',
            },
            {
            day: 3,
            title: 'Day 3: Boat Tour to Capri',
            description: 'Take a boat tour to the enchanting island of Capri, known for its stunning landscapes and crystal-clear waters.',
            },
            // Add more details as needed
            ],
            summary: {
            country: 'Italy',
            destination: 'Amalfi Coast',
            month: 'July',
            duration: '4 days',
            price: '$$$',
            },
            comments: [
            {
            author: 'Oliver',
            text: "The Amalfi Coast is breathtaking! The views are unlike anything I've ever seen.",
            },
            {
            author: 'Isabella',
            text: 'Capri is a paradise! I could spend weeks exploring its beauty.',
            },
            // Add more comments as needed
            ],
            description: 'Prekrasan dio obale u južnoj Italiji, koji se može pohvaliti dramatičnim liticama, živopisnim selima koja se spuštaju niz obronke i azurnim mediteranskim vodama, nudeći suštinski talijanski doživljaj.',
            },
            ];
            
            export default tripsData;
