/* Trip data: edit stops, itinerary, rental quotes, hotels and things to do here. */


const stops = [
  { id: 'chs', name: 'Charleston', state: 'SC', lat: 32.776, lon: -79.931, mp: null, day: 1, note: 'Start in the Lowcountry. Pick up the car at CHS and head northwest on I-26.' },
  { id: 'gvl', name: 'Greenville', state: 'SC', lat: 34.852, lon: -82.394, mp: null, day: 1, note: 'A lunch stop about halfway. Walk Falls Park and Main Street, then take US-25 or I-26 into the mountains.' },
  { id: 'avl', name: 'Asheville', state: 'NC', lat: 35.595, lon: -82.551, mp: 382, day: 1, note: 'Night 1. Join the parkway at the Folk Art Center, MP 382, the next morning.' },
  { id: 'crg', name: 'Craggy Gardens', state: 'NC', lat: 35.699, lon: -82.380, mp: 364, day: 2, note: 'Heath balds and a short climb to Craggy Pinnacle with a 360° view. One of the coldest, windiest spots on the route.' },
  { id: 'mit', name: 'Mount Mitchell', state: 'NC', lat: 35.765, lon: -82.265, mp: 355, day: 2, note: 'Turn onto NC-128 for the highest summit east of the Mississippi, 6,684 ft. The road can close in winter.' },
  { id: 'lin', name: 'Linville Falls', state: 'NC', lat: 35.955, lon: -81.927, mp: 316, day: 2, note: 'Easy trails to overlooks of the falls dropping into Linville Gorge.' },
  { id: 'lcv', name: 'Linn Cove Viaduct', state: 'NC', lat: 36.087, lon: -81.808, mp: 304, day: 2, note: 'The S-curve bridge that wraps around Grandfather Mountain, the last section of the parkway finished, in 1987.' },
  { id: 'blr', name: 'Blowing Rock', state: 'NC', lat: 36.135, lon: -81.678, mp: 291, day: 2, note: 'Night 2. A walkable mountain town just off the parkway.' },
  { id: 'dgh', name: 'Doughton Park', state: 'NC', lat: 36.430, lon: -81.180, mp: 241, day: 3, note: 'Rolling meadows, split-rail fences and the 1880s Brinegar Cabin at MP 238.5.' },
  { id: 'mab', name: 'Mabry Mill', state: 'VA', lat: 36.749, lon: -80.405, mp: 176, day: 3, note: 'The water-powered gristmill that ends up on most parkway postcards.' },
  { id: 'rkn', name: 'Rocky Knob', state: 'VA', lat: 36.818, lon: -80.346, mp: 167, day: 3, note: 'Rock Castle Gorge and a quick detour into Floyd for old-time music.' },
  { id: 'roa', name: 'Roanoke', state: 'VA', lat: 37.271, lon: -79.941, mp: 120, day: 3, note: 'Night 3 and the finish. Leave the parkway near MP 120 and drive up Mill Mountain for the Roanoke Star at dusk.' }
];

const days = [
  { n: 1, title: 'Charleston → Asheville', meta: '≈265 mi · 4.5 hr driving · I-26, I-385, US-25', text: 'The fast day. Lowcountry pines give way to Piedmont hills, then the Blue Ridge escarpment rises past Greenville. For a scenic finish, take US-276 over Caesars Head to Brevard instead.', stops: ['chs', 'gvl', 'avl'] },
  { n: 2, title: 'Asheville → Blowing Rock', meta: '≈95 mi · MP 382 → 291 · 3 hr driving, all day with stops', text: 'The highest, most dramatic stretch, with the Black Mountains, Linville Gorge and Grandfather Mountain. Start early; fog often burns off by late morning.', stops: ['crg', 'mit', 'lin', 'lcv', 'blr'] },
  { n: 3, title: 'Blowing Rock → Roanoke', meta: '≈175 mi · MP 291 → 120 · 5 hr driving', text: 'Gentler farm country with meadows, old cabins and mills. You cross into Virginia at MP 216.9 and roll into Roanoke for the night.', stops: ['dgh', 'mab', 'rkn', 'roa'] }
];

// Kayak, checked 2026-11-08: CHS Thu Nov 19 10:00 → ROA Mon Nov 23 10:00, one way. [company, car, class, total, via, midsize?]
const cars = [
  ['Alamo', 'Nissan Rogue', 'Intermediate SUV', 989, 'Booking.com', true],
  ['Enterprise', 'Nissan Rogue', 'Intermediate SUV', 1040, 'Expedia, Priceline', true],
  ['National', 'Nissan Rogue', 'Intermediate SUV', 1090, 'Expedia, Priceline', true],
  ['Enterprise', 'Hyundai Kona', 'Compact SUV', 772, 'Booking.com', false],
  ['Avis', 'Ford Explorer', 'Standard SUV', 892, 'QEEQ.com', false],
  ['Budget', 'Ford Explorer', 'Standard SUV', 892, 'QEEQ.com, Kayak', false],
  ['Alamo', 'Hyundai Kona', 'Compact SUV', 964, 'Expedia, Priceline', false],
  ['Avis', 'Nissan Pathfinder', 'Full-size SUV', 986, 'EconomyBookings', false],
  ['Alamo', 'Chevrolet Equinox', 'Standard SUV', 1040, 'Expedia, Priceline', false],
  ['National', 'Hyundai Kona', 'Compact SUV', 1065, 'Expedia, Priceline', false],
  ['Enterprise', 'Chevrolet Equinox', 'Standard SUV', 1090, 'Expedia, Priceline', false],
  ['National', 'Chevrolet Equinox', 'Standard SUV', 1141, 'Expedia, Priceline', false],
  ['Car Rental 8', 'Ford Explorer', 'Standard SUV', 606, 'Car Rental 8 · off-airport, call for pickup, cancellation fees may apply', false]
];

const hotels = [
  { where: 'Asheville, NC', when: 'Night 1 · end of day 1 · MP 382', list: [
    { name: 'The Omni Grove Park Inn', price: 4, text: '1913 granite lodge on Sunset Mountain, with giant fireplaces and a view over the city to the ridges.', tags: ['Historic', 'Spa'], q: 'Omni Grove Park Inn Asheville NC' },
    { name: 'Kimpton Hotel Arras', price: 3, text: 'Downtown on Pack Square, steps from restaurants and breweries. Easy for an evening on foot.', tags: ['Downtown', 'Walkable'], q: 'Kimpton Hotel Arras Asheville' },
    { name: 'The Foundry Hotel', price: 3, text: 'Built in a former steel foundry in The Block district, a short walk to downtown.', tags: ['Boutique', 'Downtown'], q: 'The Foundry Hotel Asheville' },
    { name: 'Chain hotels on Tunnel Road', price: 1, text: 'Plenty of familiar brands near I-240 and about 10 minutes from the parkway at MP 382.', tags: ['Budget', 'Near parkway'], q: 'hotels Tunnel Road Asheville NC' }
  ]},
  { where: 'Blowing Rock & Boone, NC', when: 'Night 2 · end of day 2 · MP 291', list: [
    { name: 'Chetola Resort', price: 3, text: 'Lakeside resort at the edge of town that backs onto the Moses Cone estate trails.', tags: ['Resort', 'Lake'], q: 'Chetola Resort Blowing Rock NC' },
    { name: 'Green Park Inn', price: 2, text: 'An 1891 hotel straddling the Eastern Continental Divide, a mile from the parkway.', tags: ['Historic'], q: 'Green Park Inn Blowing Rock NC' },
    { name: 'Westglow Resort & Spa', price: 4, text: 'A restored 1917 mansion with a long view of Grandfather Mountain.', tags: ['Spa', 'Adults focus'], q: 'Westglow Resort Spa Blowing Rock' },
    { name: 'The Horton Hotel', price: 2, text: 'Boutique hotel in downtown Boone, 15 minutes north, with a rooftop bar.', tags: ['Boutique', 'Boone'], q: 'The Horton Hotel Boone NC' }
  ]},
  { where: 'Roanoke, VA', when: 'Night 3 · end of day 3 · MP 120', list: [
    { name: 'The Hotel Roanoke & Conference Center', price: 2, text: 'Tudor-style railroad hotel from 1882, connected to downtown and the City Market by a footbridge.', tags: ['Historic', 'Downtown'], q: 'Hotel Roanoke Conference Center' },
    { name: 'The Liberty Trust', price: 3, text: 'Small hotel in a 1910s bank building downtown, with the old vault turned into a bar.', tags: ['Boutique', 'Downtown'], q: 'The Liberty Trust hotel Roanoke VA' },
    { name: 'Peaks of Otter Lodge', price: 2, text: 'On the parkway at MP 86, about 40 minutes past Roanoke on Abbott Lake. Add a night if you want more parkway.', tags: ['On the parkway', 'Extra night'], q: 'Peaks of Otter Lodge Bedford VA' }
  ]},
  { where: 'Splurge detours', when: 'Swap in for a night', list: [
    { name: 'Switzerland Inn', price: 2, text: 'Alpine-style inn at MP 334 in Little Switzerland, between Mount Mitchell and Linville Falls.', tags: ['On the parkway'], season: 'Seasonal, usually closed in winter', q: 'Switzerland Inn Little Switzerland NC' },
    { name: 'Primland Resort', price: 4, text: 'A 12,000-acre mountain resort near Meadows of Dan, MP 177, with an observatory in the lodge.', tags: ['Resort', 'Stargazing'], q: 'Primland Resort Meadows of Dan VA' }
  ]}
];

const things = [
  { day: 1, name: 'Congaree National Park', where: 'Hopkins, SC · 30 min detour from Columbia', mp: 'I-26 → I-77', type: 'hike', time: '1.5–2 hr', text: 'The 2.6-mile Boardwalk Loop runs through old-growth bottomland forest, with some of the tallest trees in the eastern U.S.', q: 'Congaree National Park Harry Hampton Visitor Center' },
  { day: 1, name: 'Falls Park on the Reedy', where: 'Downtown Greenville, SC', mp: 'I-385', type: 'town', time: '1 hr', text: 'A waterfall in the middle of downtown, crossed by the curving Liberty Bridge. Main Street lunch spots are a block away.', q: 'Falls Park on the Reedy Greenville SC' },
  { day: 1, name: 'Caesars Head State Park', where: 'US-276 · scenic alternate into Asheville', mp: 'US-276', type: 'view', time: '1–3 hr', text: 'An overlook on the edge of the Blue Ridge escarpment. Hikers can add the 4-mile round trip to Raven Cliff Falls.', q: 'Caesars Head State Park SC' },
  { day: 1, name: 'Biltmore Estate', where: 'Asheville, NC', mp: 'I-40 exit 50', type: 'culture', time: 'Half day', text: 'The Vanderbilts\' 250-room house, gardens and winery. Ticketed and timed; book ahead, especially for holiday evenings.', q: 'Biltmore Estate Asheville' },
  { day: 1, name: 'River Arts District', where: 'Asheville, NC', mp: 'I-240', type: 'town', time: '1–2 hr', text: 'Old warehouses along the French Broad full of working studios. A good place for dinner too.', q: 'River Arts District Asheville' },
  { day: 2, name: 'Folk Art Center', where: 'Blue Ridge Parkway, Asheville', mp: 382, type: 'culture', time: '45 min', text: 'Southern Highland Craft Guild gallery and shop. Your first parkway stop and a good place to get a map.', q: 'Folk Art Center Blue Ridge Parkway' },
  { day: 2, name: 'Craggy Pinnacle Trail', where: 'Craggy Gardens', mp: 364, type: 'hike', time: '1 hr', text: '1.4 miles round trip through rhododendron tunnels to a rocky summit with a full-circle view.', q: 'Craggy Pinnacle Trail' },
  { day: 2, name: 'Mount Mitchell State Park', where: 'NC-128, 5 mi off the parkway', mp: 355, type: 'view', time: '1–1.5 hr', text: 'Drive almost to the top, then walk a short paved path to the summit platform at 6,684 ft.', q: 'Mount Mitchell State Park', season: 'Road may close in ice or snow' },
  { day: 2, name: 'Museum of North Carolina Minerals', where: 'Spruce Pine', mp: 331, type: 'culture', time: '30 min', text: 'Small free museum about the region\'s gem and mica mining. A good restroom-and-coffee stop.', q: 'Museum of North Carolina Minerals' },
  { day: 2, name: 'Linville Falls', where: 'Linville Falls Visitor Center', mp: 316, type: 'hike', time: '1–2 hr', text: 'The Erwins View Trail is 1.6 miles round trip with four overlooks, the last looking straight down the gorge.', q: 'Linville Falls Visitor Center Blue Ridge Parkway' },
  { day: 2, name: 'Grandfather Mountain', where: 'US-221, off the parkway at MP 305', mp: 305, type: 'view', time: '2–3 hr', text: 'Private nature park with the Mile High Swinging Bridge and wildlife habitats. Ticketed.', q: 'Grandfather Mountain Linville NC' },
  { day: 2, name: 'Linn Cove Viaduct', where: 'Grandfather Mountain', mp: 304, type: 'view', time: '30 min', text: 'Park at the visitor area and walk the Tanawha Trail underneath for the classic view of the curving bridge.', q: 'Linn Cove Viaduct' },
  { day: 2, name: 'Moses H. Cone Memorial Park', where: 'Flat Top Manor', mp: 294, type: 'culture', time: '1 hr', text: 'A 1901 manor house on a hill with 25 miles of carriage roads. The Parkway Craft Center sells local work inside.', q: 'Moses H Cone Memorial Park Flat Top Manor' },
  { day: 2, name: 'Downtown Blowing Rock', where: 'Blowing Rock, NC', mp: 291, type: 'town', time: 'Evening', text: 'Main Street shops, a small park and a dozen dinner options, all walkable from the inns.', q: 'Main Street Blowing Rock NC' },
  { day: 3, name: 'Doughton Park & Brinegar Cabin', where: 'Alleghany County, NC', mp: 241, type: 'hike', time: '1–2 hr', text: 'Open meadows with deer at dawn. Walk part of the Bluff Mountain Trail, then see the 1880s cabin at MP 238.5.', q: 'Doughton Park Blue Ridge Parkway' },
  { day: 3, name: 'Blue Ridge Music Center', where: 'Near Galax, VA', mp: 213, type: 'culture', time: '1 hr', text: 'Museum of old-time and bluegrass music, with jam sessions on many afternoons.', q: 'Blue Ridge Music Center', season: 'Mainly May–October' },
  { day: 3, name: 'Mabry Mill', where: 'Meadows of Dan, VA', mp: 176, type: 'culture', time: '45 min', text: 'A 1910 gristmill and blacksmith shop on a millpond. Come early or late to photograph it without crowds.', q: 'Mabry Mill Blue Ridge Parkway', season: 'Restaurant closes for winter' },
  { day: 3, name: 'Rock Castle Gorge', where: 'Rocky Knob Recreation Area', mp: 167, type: 'hike', time: '1–5 hr', text: 'Short walks to the Rocky Knob overlook, or the full 10.8-mile gorge loop if you have a day to spare.', q: 'Rock Castle Gorge Trail Rocky Knob' },
  { day: 3, name: 'Floyd Country Store', where: 'Floyd, VA · 6 mi north on VA-8', mp: 165, type: 'town', time: 'Evening', text: 'Old general store known for its Friday Night Jamboree of old-time music and flatfoot dancing.', q: 'Floyd Country Store Floyd VA' },
  { day: 3, name: 'Mill Mountain Star', where: 'Roanoke, VA', mp: 120, type: 'view', time: '45 min', text: 'An 88-foot neon star on the mountain above town. The overlook is at its best just after sunset.', q: 'Roanoke Star Mill Mountain' },
  { day: 3, name: 'Roanoke City Market & Taubman Museum', where: 'Downtown Roanoke', mp: 'I-581', type: 'town', time: '2 hr', text: 'A farmers market running since 1882, food stalls, and an art museum in a striking steel-and-glass building next door.', q: 'Roanoke City Market' },
  { day: 3, name: 'McAfee Knob', where: 'VA-311, 20 min from Roanoke', mp: 'VA-311', type: 'hike', time: '4–5 hr', text: 'A 7.8-mile round trip on the Appalachian Trail to the most photographed ledge on the whole AT. A good finish-day hike.', q: 'McAfee Knob Trailhead' }
];

const typeNames = { hike: 'Hikes', view: 'Views', town: 'Towns & food', culture: 'History & culture' };
