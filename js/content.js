/* All words and photo facts for the presentation live here.
   Definitions follow the class handouts "Composition" and
   "Elements of Photographic Composition and Design". */
(function () {
  'use strict';

  var GROUP = ['Wynn Morgan', 'Ryan Barbra', 'Mithun Chigurupati'];

  var ELEMENTS = [
    {
      key: 'thirds', num: 1, name: 'Rule of Thirds', short: 'Thirds',
      demo: 'thirds',
      lede: 'Split the frame into a 3 × 3 grid. Put the subject or the horizon on one of the lines, or where two lines cross, so nothing important cuts the picture in half.',
      points: [
        'The four crossings are called <strong>power points</strong>. The eye goes there first.',
        'A horizon on the top line gives you more land. On the bottom line, more sky.',
        'It is a simpler version of the <strong>golden mean</strong> (1 : 1.618), whose lines sit at 3/8 and 5/8.'
      ]
    },
    {
      key: 'framing', num: 2, name: 'Framing', short: 'Framing',
      sub: 'Depth & Perspective · Selecting a Viewpoint',
      demo: 'viewpoint',
      lede: 'Framing is choosing what goes inside the edges, often using a doorway, branches or people as a frame inside the frame. Viewpoint is where you stand when you take the picture.',
      points: [
        'From above, a child looks small. At their eye level they look like an equal. From below they look powerful.',
        'A foreground, middle ground and background give a flat photo depth.',
        'Moving closer, lower or to the side can cut out distractions.'
      ]
    },
    {
      key: 'light', num: 3, name: 'Light and Shadows', short: 'Light',
      demo: 'light',
      lede: 'Photography literally means “drawing with light.” Where the light comes from, and how hard or soft it is, decides the shadows. Shadows give a picture depth and mood.',
      points: [
        'Early morning and late afternoon sun makes long shadows.',
        'Direct sun gives hard, crisp shadows. Clouds give soft ones.',
        'Side light shapes a face. Backlight makes a silhouette.'
      ]
    },
    {
      key: 'lines', num: 4, name: 'Lines', short: 'Lines',
      sub: 'Leading Lines · Diagonal Lines',
      demo: 'lines',
      lede: 'Lines move your eye through a picture. Leading lines point it at the subject, and each direction has its own feel.',
      points: [
        'Horizontal lines feel calm. Vertical lines feel tall and strong.',
        'Diagonal lines feel like movement and tension.',
        'Curved lines flow. Converging lines pull you into the distance.'
      ]
    },
    {
      key: 'shape', num: 5, name: 'Shape', short: 'Shape', sub: 'Two-dimensional',
      demo: 'shape',
      lede: 'A shape is a flat outline, like a circle, a triangle, a leaf or a person. Shapes read strongest as silhouettes, with no detail inside.',
      points: [
        'We recognize a shape before we notice any detail.',
        'Backlight and strong contrast flatten a subject into a shape.',
        'Look for shapes that repeat across the frame.'
      ]
    },
    {
      key: 'form', num: 6, name: 'Form', short: 'Form', sub: 'Three-dimensional',
      demo: 'form',
      lede: 'Form is a shape with depth. Light and shadow show it. When a surface goes smoothly from bright to dark, your eye reads it as round and solid.',
      points: [
        'Side light shows form. Flat front light hides it.',
        'Soft light gives the smoothest shading.',
        'No shadow, no form.'
      ]
    },
    {
      key: 'space', num: 7, name: 'Positive & Negative Space', short: 'Space',
      demo: 'space',
      lede: 'Positive space is the subject itself, such as a person in a portrait, objects in a still life, or the shapes of furniture in a room. Negative space is the background, the empty areas around and between subjects.',
      points: [
        'Empty space gives the subject room and shows how big or small it is.',
        'Leave space in front of a moving subject, or where a person is looking.',
        'Contrast between subject and background makes the subject stand out.'
      ]
    },
    {
      key: 'texture', num: 8, name: 'Texture', short: 'Texture',
      demo: 'texture',
      lede: 'Texture is how a surface would feel: rough, smooth, cracked, soft. A good photo lets you feel it just by looking.',
      points: [
        'Low light from the side shows texture best. Light from the front flattens it.',
        'Get close and fill the frame.',
        'Keep it sharp. Texture lives in the detail.'
      ]
    },
    {
      key: 'pattern', num: 9, name: 'Pattern', short: 'Pattern',
      demo: 'pattern',
      lede: 'A pattern is something repeated, like shapes, lines or colors at regular spacing. One break in the pattern instantly becomes the subject.',
      points: [
        'Fill the frame so the pattern seems to keep going.',
        'Shoot straight on or straight down to keep it even.',
        'Look for the odd one out.'
      ]
    },
    {
      key: 'simplicity', num: 10, name: 'Simplicity', short: 'Simplicity',
      demo: 'simplicity',
      lede: 'Clutter makes the subject hard to find. Take out whatever doesn’t help, and the viewer goes straight to what matters.',
      points: [
        'If something adds nothing, move or reframe until it’s gone.',
        'A wide aperture, like f/1.8, blurs the background.',
        'A plain background works right away.'
      ]
    }
  ];

  /* img: how to find the picture.
       local  - path inside this repo (always tried first; see photos/manifest.js)
       file   - exact Wikimedia Commons file name
       wiki   - English Wikipedia article whose lead image is this photograph
       search - Wikimedia Commons file search, used only as a last resort
     rights: 'pd' public domain, 'c' copyrighted (shown for classroom use) */
  var PHOTOS = [
    /* 01 Rule of Thirds */
    {
      id: 'earthrise', el: 'thirds', title: 'Earthrise', by: 'William Anders', org: 'NASA, Apollo 8', year: '1968',
      date: 'December 24, 1968', place: 'Lunar orbit', camera: 'Hasselblad 500 EL, 250 mm lens',
      img: { file: 'NASA-Apollo8-Dec24-Earthrise.jpg', wiki: 'Earthrise' }, link: 'https://en.wikipedia.org/wiki/Earthrise', rights: 'pd',
      story: 'On Apollo 8’s fourth orbit of the Moon, the crew watched Earth come up over the horizon. Anders grabbed a camera with color film and took this.',
      look: 'The Moon’s horizon sits low and Earth floats high and off-center, near a power point. All that black space shows how small Earth is.',
      tags: ['space']
    },
    {
      id: 'afghan-girl', el: 'thirds', title: 'Afghan Girl', by: 'Steve McCurry', year: '1984',
      date: '1984', place: 'Nasir Bagh refugee camp, Pakistan', camera: 'Nikon FM2, Kodachrome 64 film',
      img: { wiki: 'Afghan_Girl' }, link: 'https://en.wikipedia.org/wiki/Afghan_Girl', rights: 'c',
      story: 'McCurry photographed 12-year-old Sharbat Gula at a refugee camp in Pakistan. It ran on the cover of National Geographic in June 1985.',
      look: 'Her eyes sit right on the upper third line, and their green stands out against her red shawl.',
      tags: ['light']
    },
    {
      id: 'moonrise', el: 'thirds', title: 'Moonrise, Hernandez, New Mexico', by: 'Ansel Adams', year: '1941',
      date: 'November 1, 1941', place: 'Hernandez, New Mexico', camera: '8×10 view camera',
      img: { wiki: 'Moonrise,_Hernandez,_New_Mexico' }, link: 'https://en.wikipedia.org/wiki/Moonrise,_Hernandez,_New_Mexico', rights: 'c',
      story: 'Adams pulled over at dusk and couldn’t find his light meter, so he worked out the exposure from how bright the moon was. He got one shot before the light faded.',
      look: 'The village and mountains fill the lower third. Dark sky takes up the rest, with the moon up high.',
      tags: ['light', 'space']
    },

    /* 02 Framing */
    {
      id: 'clearing-storm', el: 'framing', title: 'Clearing Winter Storm, Yosemite National Park', by: 'Ansel Adams', year: 'c. 1937',
      date: 'c. 1937', place: 'Yosemite Valley, California', camera: 'Large-format view camera',
      img: { wiki: 'Clearing_Winter_Storm,_Yosemite_National_Park' }, link: 'https://en.wikipedia.org/wiki/Clearing_Winter_Storm,_Yosemite_National_Park', rights: 'c',
      story: 'Adams shot Yosemite Valley as a winter storm was clearing. It is his most famous Yosemite picture.',
      look: 'El Capitan on the left and Bridalveil Fall on the right frame the valley like curtains. Forest, cliffs, clouds and Half Dome stack back into deep space.',
      tags: ['light']
    },
    {
      id: 'migrant-mother', el: 'framing', title: 'Migrant Mother', by: 'Dorothea Lange', org: 'Resettlement Administration', year: '1936',
      date: 'March 1936', place: 'Nipomo, California', camera: 'Graflex camera',
      img: { file: 'Lange-MigrantMother02.jpg', wiki: 'Migrant_Mother' }, link: 'https://en.wikipedia.org/wiki/Migrant_Mother', rights: 'pd',
      story: 'Lange photographed Florence Owens Thompson, 32, and her children at a pea pickers’ camp, moving closer with each shot. The last frame became the face of the Great Depression.',
      look: 'Her two children turn away and frame her worried face. Her hand at her chin points you right to it.',
      tags: ['texture']
    },
    {
      id: 'lunch-skyscraper', el: 'framing', title: 'Lunch atop a Skyscraper', by: 'Unknown (attributed to Charles C. Ebbets)', year: '1932',
      date: 'September 20, 1932', place: 'RCA Building, Rockefeller Center, New York',
      img: { wiki: 'Lunch_atop_a_Skyscraper' }, link: 'https://en.wikipedia.org/wiki/Lunch_atop_a_Skyscraper', rights: 'c',
      story: 'Eleven ironworkers eat lunch on a beam 69 floors above Manhattan. It was a staged publicity photo, and nobody knows for sure who took it.',
      look: 'The camera is level with the beam, so you feel like you’re up there too. The city far below gives it dizzying depth.',
      tags: ['lines', 'pattern']
    },

    /* 03 Light and Shadows */
    {
      id: 'roaring-lion', el: 'light', title: 'The Roaring Lion', by: 'Yousuf Karsh', year: '1941',
      date: 'December 30, 1941', place: 'Speaker’s Chamber, Parliament of Canada, Ottawa', camera: 'Large-format camera, studio lights',
      img: { file: 'Sir Winston Churchill - 19086236948.jpg', wiki: 'The_Roaring_Lion' }, link: 'https://en.wikipedia.org/wiki/The_Roaring_Lion', rights: 'pd',
      story: 'Churchill wouldn’t put down his cigar, so Karsh walked up and took it out of his mouth. Then he took the picture.',
      look: 'Hard light from the side carves Churchill’s face out of the dark background. A second light outlines his shoulders.',
      tags: ['form']
    },
    {
      id: 'wall-street', el: 'light', title: 'Wall Street', by: 'Paul Strand', year: '1915',
      date: '1915', place: 'Wall Street, New York',
      img: { file: 'Wall Street by Paul Strand, 1915.jpg', wiki: 'Wall_Street_(photograph)' }, link: 'https://en.wikipedia.org/wiki/Wall_Street_(photograph)', rights: 'pd',
      story: 'Strand stood on the steps of Federal Hall during the morning rush and pointed his camera at the J. P. Morgan bank.',
      look: 'Low morning sun stretches every walker’s shadow into a long diagonal. The bank’s dark windows tower over the tiny people.',
      tags: ['pattern', 'lines']
    },
    {
      id: 'flatiron', el: 'light', title: 'The Flatiron', by: 'Edward Steichen', year: '1904',
      date: '1904 (printed 1904–1909)', place: 'Madison Square, New York', camera: 'Gum bichromate over platinum prints',
      img: { wiki: 'The_Flatiron_(photograph)' }, link: 'https://en.wikipedia.org/wiki/The_Flatiron_(photograph)', rights: 'pd',
      story: 'Steichen shot the new Flatiron Building at dusk, then made three hand-colored prints of it.',
      look: 'The evening sky turns the tree branch and carriages into silhouettes, and haze makes the building look like a ghost.',
      tags: ['framing', 'shape']
    },

    /* 04 Lines */
    {
      id: 'tetons', el: 'lines', title: 'The Tetons and the Snake River', by: 'Ansel Adams', org: 'National Park Service', year: '1942',
      date: '1942', place: 'Grand Teton National Park, Wyoming',
      img: { file: 'Adams The Tetons and the Snake River.jpg' }, link: 'https://en.wikipedia.org/wiki/The_Tetons_and_the_Snake_River', rights: 'pd',
      story: 'Adams took this for the National Park Service. In 1977 it went into space on the Voyager Golden Record.',
      look: 'The river’s S-curve leads your eye from the bottom of the frame up to the mountains.',
      tags: ['light']
    },
    {
      id: 'steerage', el: 'lines', title: 'The Steerage', by: 'Alfred Stieglitz', year: '1907',
      date: '1907', place: 'Aboard the SS Kaiser Wilhelm II', camera: 'Hand camera, 4×5 glass plate',
      img: { wiki: 'The_Steerage', file: 'The Steerage 1907 Stieglitz.jpg' }, link: 'https://en.wikipedia.org/wiki/The_Steerage', rights: 'pd',
      story: 'Sailing to Europe, Stieglitz looked down from the first-class deck at the passengers in steerage and ran back for his camera. He later said it was the one photo he’d pick to be remembered by.',
      look: 'The white gangway cuts diagonally across the frame and splits the two decks. The funnel, ladder and mast add more lines.',
      tags: ['shape', 'framing']
    },
    {
      id: 'iwo-jima', el: 'lines', title: 'Raising the Flag on Iwo Jima', by: 'Joe Rosenthal', org: 'Associated Press', year: '1945',
      date: 'February 23, 1945', place: 'Mount Suribachi, Iwo Jima', camera: 'Speed Graphic',
      img: { wiki: 'Raising_the_Flag_on_Iwo_Jima' }, link: 'https://en.wikipedia.org/wiki/Raising_the_Flag_on_Iwo_Jima', rights: 'c',
      story: 'Five days into the battle, six Marines raised a flag on Mount Suribachi. Rosenthal shot it with no time to compose, and it won the 1945 Pulitzer Prize.',
      look: 'The flagpole is one strong diagonal, and the Marines lean along it. That diagonal is what makes it feel like motion.',
      tags: ['shape']
    },

    /* 05 Shape */
    {
      id: 'stravinsky', el: 'shape', title: 'Igor Stravinsky', by: 'Arnold Newman', year: '1946',
      date: '1946', place: 'New York City', featured: true,
      img: { local: 'assets/photos/stravinsky-newman-1946.jpg' }, link: 'https://en.wikipedia.org/wiki/Arnold_Newman', rights: 'c',
      story: 'This iconic black-and-white photograph is a 1946 portrait of the Russian composer Igor Stravinsky, taken in New York City by the American photographer Arnold Newman. It is widely considered a landmark work of environmental portraiture that helped define modern 20th-century photography.',
      look: 'Stravinsky is placed in the bottom-left corner of the frame. The raised lid of a grand piano dominates the image, silhouetted against a stark white wall to resemble an abstract musical flat symbol (♭). It is an example of Shape and Framing.',
      note: 'Our instructor’s note',
      tags: ['framing', 'space']
    },
    {
      id: 'saint-lazare', el: 'shape', title: 'Behind the Gare Saint-Lazare', by: 'Henri Cartier-Bresson', year: '1932',
      date: '1932', place: 'Paris', camera: 'Leica rangefinder',
      img: { wiki: 'Behind_the_Gare_Saint-Lazare' }, link: 'https://en.wikipedia.org/wiki/Behind_the_Gare_Saint-Lazare', rights: 'c',
      story: 'Cartier-Bresson shot through a gap in a fence and caught a man jumping over a flooded yard. It is the classic “decisive moment.”',
      look: 'The man is a black silhouette, and the water repeats his shape. A poster behind him shows a dancer in almost the same leap.',
      tags: ['pattern']
    },
    {
      id: 'milk-drop', el: 'shape', title: 'Milk Drop Coronet', by: 'Harold Edgerton', year: '1957',
      date: 'January 10, 1957', place: 'MIT, Cambridge, Massachusetts', camera: 'Electronic strobe flash, about 1/1,000,000 s',
      img: { wiki: 'Milk_Drop_Coronet' }, link: 'https://en.wikipedia.org/wiki/Milk_Drop_Coronet', rights: 'c',
      story: 'Edgerton used a flash that lasted about a millionth of a second to freeze a drop of milk hitting a surface.',
      look: 'The splash forms a crown against a plain background. The shape is the whole picture.',
      tags: ['simplicity', 'pattern']
    },

    /* 06 Form */
    {
      id: 'pepper', el: 'form', title: 'Pepper No. 30', by: 'Edward Weston', year: '1930',
      date: '1930', place: 'Carmel, California', camera: '8×10 view camera',
      img: { file: 'Pepper No. 30.jpg', wiki: 'Pepper_No._30' }, link: 'https://en.wikipedia.org/wiki/Pepper_No._30', rights: 'c',
      story: 'Weston put the pepper inside a tin funnel to bounce soft light around it. He called it “a pepper — but more than a pepper: abstract.”',
      look: 'Soft light wraps around every fold, going smoothly from bright to dark. That shading makes it look solid, like a sculpture.',
      tags: ['simplicity', 'light']
    },
    {
      id: 'nautilus', el: 'form', title: 'Nautilus', by: 'Edward Weston', year: '1927',
      date: '1927', place: 'Glendale, California', camera: '8×10 view camera, exposure of several hours',
      img: { wiki: 'Nautilus_(photograph)' }, link: 'https://en.wikipedia.org/wiki/Nautilus_(photograph)', rights: 'c',
      story: 'Weston stood a nautilus shell on end against a dark background for an exposure that lasted hours.',
      look: 'Light falls across the spiral from bright to dark, so the shell looks round and solid. Nothing else is in the frame.',
      tags: ['simplicity', 'shape']
    },
    {
      id: 'mechanic', el: 'form', title: 'Power House Mechanic Working on Steam Pump', by: 'Lewis Hine', year: '1920',
      date: '1920', place: 'United States',
      img: { file: 'Lewis Hine Power house mechanic working on steam pump.jpg' }, link: 'https://www.archives.gov/exhibits/picturing_the_century/port_hine/port_hine_img22.html', rights: 'pd',
      story: 'Hine was known for photographing child labor. In the 1920s he started making what he called “work portraits” of factory workers.',
      look: 'Light picks out the muscles in his arms and back. The curve of his body matches the curves of the machine.',
      tags: ['shape', 'light']
    },

    /* 07 Positive & Negative Space */
    {
      id: 'pale-blue-dot', el: 'space', title: 'Pale Blue Dot', by: 'Voyager 1', org: 'NASA, at the request of Carl Sagan', year: '1990',
      date: 'February 14, 1990', place: 'About 3.7 billion miles from the Sun',
      img: { file: 'PIA23645-Earth-PaleBlueDot-6Bkm-Voyager1-orig19900214-upd20200212.jpg', wiki: 'Pale_Blue_Dot' }, link: 'https://en.wikipedia.org/wiki/Pale_Blue_Dot', rights: 'pd',
      story: 'At Carl Sagan’s request, NASA turned Voyager 1 around to look back at Earth from 3.7 billion miles away. Earth is less than one pixel.',
      look: 'Almost the whole frame is empty space. That’s why the tiny dot hits so hard.',
      tags: ['simplicity']
    },
    {
      id: 'tank-man', el: 'space', title: 'Tank Man', by: 'Jeff Widener', org: 'Associated Press', year: '1989',
      date: 'June 5, 1989', place: 'Chang’an Avenue, Beijing', camera: 'Telephoto lens from a sixth-floor balcony',
      img: { wiki: 'Tank_Man' }, link: 'https://en.wikipedia.org/wiki/Tank_Man', rights: 'c',
      story: 'The day after the Tiananmen Square crackdown, a man with shopping bags stood in front of a line of tanks. Nobody knows who he was.',
      look: 'The empty road around him makes him look small and alone against the tanks.',
      tags: ['framing', 'pattern']
    },
    {
      id: 'mccandless', el: 'space', title: 'Bruce McCandless II, First Untethered Spacewalk', by: 'NASA', org: 'Space Shuttle Challenger, STS-41-B', year: '1984',
      date: 'February 1984', place: 'Earth orbit',
      img: { file: 'Bruce McCandless II during EVA in 1984.jpg' }, link: 'https://en.wikipedia.org/wiki/Bruce_McCandless_II', rights: 'pd',
      story: 'McCandless was the first person to float free in space with no tether, using a jet-powered backpack.',
      look: 'One person surrounded by black space. The emptiness is the whole feeling of the picture.',
      tags: ['simplicity']
    },

    /* 08 Texture */
    {
      id: 'bootprint', el: 'texture', title: 'Apollo 11 Bootprint', by: 'Buzz Aldrin', org: 'NASA, Apollo 11', year: '1969',
      date: 'July 20, 1969', place: 'Sea of Tranquility, the Moon', camera: 'Hasselblad camera',
      img: { file: 'Apollo 11 bootprint.jpg' }, link: 'https://en.wikipedia.org/wiki/Apollo_11', rights: 'pd',
      story: 'Aldrin photographed his own bootprint to study the Moon’s soil.',
      look: 'The low sun makes every ridge of the tread cast a tiny shadow, so you can almost feel the dust.',
      tags: ['light', 'pattern']
    },
    {
      id: 'floyd-burroughs', el: 'texture', title: 'Floyd Burroughs, Cotton Sharecropper', by: 'Walker Evans', year: '1936',
      date: '1936', place: 'Hale County, Alabama', camera: '8×10 view camera',
      img: { file: 'Floyd Burroughs, cotton sharecropper. Hale County, Alabama LOC 3549662506.jpg' }, link: 'https://en.wikipedia.org/wiki/Let_Us_Now_Praise_Famous_Men', rights: 'pd',
      story: 'Evans spent the summer of 1936 with sharecropper families in Alabama. The photos became the book Let Us Now Praise Famous Men.',
      look: 'His large camera picks up every thread of the worn clothes and every line on the face.',
      tags: ['form']
    },
    {
      id: 'skull', el: 'texture', title: 'Skull, Badlands, South Dakota', by: 'Arthur Rothstein', org: 'Farm Security Administration', year: '1936',
      date: 'May 1936', place: 'Badlands, South Dakota',
      img: { search: 'Rothstein bleached skull steer sun-baked earth South Dakota' }, link: 'https://en.wikipedia.org/wiki/Arthur_Rothstein', rights: 'pd',
      story: 'Rothstein moved a steer skull onto cracked, dry ground to photograph it. When people found out, critics called the photo fake.',
      look: 'The rough, cracked earth sits right next to the smooth bone, and each texture makes the other stand out.',
      tags: ['light', 'shape']
    },

    /* 09 Pattern */
    {
      id: '99-cent', el: 'pattern', title: '99 Cent', by: 'Andreas Gursky', year: '1999',
      date: '1999', place: 'Los Angeles', camera: 'Large-format camera, digitally assembled',
      img: { wiki: '99_Cent_(photograph)' }, link: 'https://en.wikipedia.org/wiki/99_Cent_(photograph)', rights: 'c',
      story: 'Gursky photographed a discount store in Los Angeles and edited it digitally so every shelf is sharp.',
      look: 'Rows of products repeat across the whole frame, and the shiny ceiling repeats them again.',
      tags: ['lines']
    },
    {
      id: 'horse', el: 'pattern', title: 'The Horse in Motion', by: 'Eadweard Muybridge', year: '1878',
      date: 'June 1878', place: 'Palo Alto, California', camera: 'A row of cameras triggered as the horse ran past',
      img: { file: 'The Horse in Motion high res.jpg', wiki: 'The_Horse_in_Motion' }, link: 'https://en.wikipedia.org/wiki/The_Horse_in_Motion', rights: 'pd',
      story: 'Muybridge set up a row of cameras along a track to prove that a galloping horse has all four hooves off the ground at once.',
      look: 'The same horse repeats frame after frame with small changes, like a beat.',
      tags: ['shape']
    },
    {
      id: 'abbey-road', el: 'pattern', title: 'Abbey Road', by: 'Iain Macmillan', year: '1969',
      date: 'August 8, 1969', place: 'Abbey Road, London', camera: 'Hasselblad, from a stepladder',
      img: { wiki: 'Abbey_Road_(album)' }, link: 'https://en.wikipedia.org/wiki/Abbey_Road', rights: 'c',
      story: 'Macmillan stood on a stepladder in the middle of the road and had about ten minutes. He took six shots, and the fifth, the only one with all four Beatles in step, became the cover.',
      look: 'Four people in the same stride repeat across the frame, with the crosswalk stripes repeating underneath.',
      tags: ['lines']
    },

    /* 10 Simplicity */
    {
      id: 'rhein-ii', el: 'simplicity', title: 'Rhein II', by: 'Andreas Gursky', year: '1999',
      date: '1999', place: 'The Lower Rhine near Düsseldorf, Germany',
      img: { wiki: 'Rhein_II' }, link: 'https://en.wikipedia.org/wiki/Rhein_II', rights: 'c',
      story: 'Gursky digitally removed people and a factory from the riverbank. In 2011 a print sold for $4.3 million.',
      look: 'The picture is just stripes: grass, river, grass, sky.',
      tags: ['lines']
    },
    {
      id: 'bliss', el: 'simplicity', title: 'Bliss', by: 'Charles O’Rear', year: '1996',
      date: 'January 1996', place: 'Sonoma County, California', camera: 'Mamiya RZ67, Fujifilm Velvia film',
      img: { wiki: 'Bliss_(photograph)' }, link: 'https://en.wikipedia.org/wiki/Bliss_(photograph)', rights: 'c',
      story: 'O’Rear photographed a green hill in California wine country after the rain. It became the Windows XP wallpaper, maybe the most viewed photo ever.',
      look: 'One hill, one sky, a few clouds. Nothing else to look at.',
      tags: ['lines']
    },
    {
      id: 'equivalents', el: 'simplicity', title: 'Equivalent', by: 'Alfred Stieglitz', year: '1925–1934',
      date: '1925–1934 (series)', place: 'Lake George, New York',
      img: { wiki: 'Equivalents' }, link: 'https://en.wikipedia.org/wiki/Equivalents', rights: 'c',
      story: 'Stieglitz made more than 220 photos of clouds. With no ground or horizon, they were some of the first abstract photographs.',
      look: 'Only sky and cloud are left, so the picture is just tone and shape.',
      tags: ['shape', 'light']
    }
  ];

  var VIDEO = {
    id: '7ZVyNjKSr0M',
    title: '9 Photo Composition Tips (feat. Steve McCurry)',
    channel: 'COOPH, The Cooperative of Photography',
    url: 'https://www.youtube.com/watch?v=7ZVyNjKSr0M',
    tips: [
      { name: 'Rule of thirds', el: 'thirds' },
      { name: 'Leading lines', el: 'lines' },
      { name: 'Diagonals', el: 'lines' },
      { name: 'Framing', el: 'framing' },
      { name: 'Figure to ground', el: 'space' },
      { name: 'Fill the frame', el: 'simplicity' },
      { name: 'Center dominant eye', el: 'thirds' },
      { name: 'Patterns and repetition', el: 'pattern' },
      { name: 'Symmetry', el: 'shape' }
    ]
  };

  var SOURCES = [
    { label: 'Class handout: “Composition” (elements and principles of design, viewpoint, rule of thirds, rule of space, simplification)' },
    { label: 'Class handout: “Elements of Photographic Composition and Design” (the ten elements)' },
    { label: 'Top 25 Fine Art Photography Artists in the World, Contemporary Art Issue', href: 'https://www.contemporaryartissue.com/top-25-fine-art-photography-artists-in-the-world/' },
    { label: 'AAP Magazine #47: Shadows', href: 'https://www.blurb.com/books/12463531-aap-magazine-47-shadows' },
    { label: 'AAP Magazine #50: Shapes', href: 'https://www.blurb.com/books/12557334-aap-magazine-50-shapes' },
    { label: 'The Best Photographers of All Time, Wardynski Photo', href: 'https://www.wardynskiphoto.com/gallery/the-best-photographers-of-all-time/' },
    { label: 'COOPH, “9 Photo Composition Tips (feat. Steve McCurry)”', href: 'https://www.youtube.com/watch?v=7ZVyNjKSr0M' },
    { label: 'Photograph files and facts: Wikipedia and Wikimedia Commons', href: 'https://commons.wikimedia.org/' }
  ];

  window.CIP = { GROUP: GROUP, ELEMENTS: ELEMENTS, PHOTOS: PHOTOS, VIDEO: VIDEO, SOURCES: SOURCES };
})();
