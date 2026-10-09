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
      lede: 'Divide the frame into nine equal parts with two horizontal and two vertical lines. Place the subject and other areas of interest, like the horizon, on those lines, ideally where they cross, so nothing important cuts the picture exactly in half.',
      points: [
        'The four crossings are called <strong>power points</strong>. The eye settles there naturally.',
        'Put the horizon on the <strong>top line</strong> to stress the land, or on the <strong>bottom line</strong> to stress the sky.',
        'It simplifies the <strong>golden mean</strong> (1 : 1.618), whose lines fall at 3/8 and 5/8 instead of 1/3 and 2/3.'
      ]
    },
    {
      key: 'framing', num: 2, name: 'Framing', short: 'Framing',
      sub: 'Depth & Perspective · Selecting a Viewpoint',
      demo: 'viewpoint',
      lede: 'Framing decides what the edges include and leave out, often by using something in the scene, like a doorway, branches or other people, as a frame within the frame. Viewpoint is where the camera stands. Together they create depth and decide how we relate to the subject.',
      points: [
        'Photographed <strong>from above</strong>, a child looks smaller. <strong>At the child\'s level</strong> they become an equal. <strong>From below</strong> they look dominant.',
        'Layer a <strong>foreground, middle ground and background</strong> and a flat print reads as deep space.',
        'Moving closer, sideways, higher or lower <strong>removes distractions</strong> before you press the shutter.'
      ]
    },
    {
      key: 'light', num: 3, name: 'Light and Shadows', short: 'Light',
      demo: 'light',
      lede: 'Photography means “drawing with light,” from the Greek words phos (light) and graphe (drawing). The direction, quality and angle of light create highlights and shadows, and shadows give a picture depth, contrast, mood and shape.',
      points: [
        'A <strong>low sun</strong> in early morning or late afternoon throws long, raking shadows.',
        '<strong>Hard light</strong> from a small source makes crisp shadow edges. <strong>Soft light</strong> from a large or diffused source wraps gently.',
        '<strong>Side light</strong> models a face. <strong>Backlight</strong> turns subjects into silhouettes.'
      ]
    },
    {
      key: 'lines', num: 4, name: 'Lines', short: 'Lines',
      sub: 'Leading Lines · Diagonal Lines',
      demo: 'lines',
      lede: 'A line is the visual path that moves the eye through a picture. Leading lines pull the eye toward the main subject, and every direction a line takes carries its own feeling.',
      points: [
        '<strong>Horizontal</strong> lines feel calm and spacious. <strong>Vertical</strong> lines suggest height and grandeur.',
        '<strong>Diagonal</strong> lines convey movement, energy and tension.',
        '<strong>Curved</strong> lines create flow. <strong>Converging</strong> lines create depth and lead to a point.'
      ]
    },
    {
      key: 'shape', num: 5, name: 'Shape', short: 'Shape', sub: 'Two-dimensional',
      demo: 'shape',
      lede: 'A shape is a flat, two-dimensional area defined by its edges. Shapes can be geometric, like circles, triangles and rectangles, or organic, like leaves, bodies and clouds. Shape reads strongest in silhouette, when contrast removes the detail inside.',
      points: [
        'We recognize <strong>shape before detail</strong>, so a clear silhouette reads instantly.',
        '<strong>Backlight and high contrast</strong> flatten a subject into pure shape.',
        'Look for shapes that <strong>echo each other</strong> across the frame.'
      ]
    },
    {
      key: 'form', num: 6, name: 'Form', short: 'Form', sub: 'Three-dimensional',
      demo: 'form',
      lede: 'Form is shape with volume: length, width and depth. Light reveals it. Tone that grades smoothly from highlight to shadow tells the eye that a surface is turning away into space.',
      points: [
        '<strong>Side light</strong> shows form. <strong>Flat front light</strong> hides it and reduces form to shape.',
        'Soft, directional light gives the <strong>smoothest gradations</strong>.',
        'Without <strong>shadow</strong>, there is no visible form.'
      ]
    },
    {
      key: 'space', num: 7, name: 'Positive & Negative Space', short: 'Space',
      demo: 'space',
      lede: 'Positive space is the subject itself, such as a person in a portrait, objects in a still life, or the shapes of furniture in a room. Negative space is the background: the empty areas around and between subjects.',
      points: [
        'Negative space is not wasted. It gives the subject <strong>room to breathe</strong> and shows its scale.',
        'Leave space <strong>in front of a moving subject</strong> or in the direction a person looks.',
        'Strong <strong>figure and ground</strong> contrast separates the subject from its surroundings.'
      ]
    },
    {
      key: 'texture', num: 8, name: 'Texture', short: 'Texture',
      demo: 'texture',
      lede: 'Texture is the surface quality of a subject: rough, smooth, soft, cracked. A photograph can only be seen, so texture works as a tactile illusion. Good texture lets you feel a surface with your eyes.',
      points: [
        '<strong>Raking light</strong>, low and from the side, makes texture leap out. Light from the front flattens it.',
        'Get close and <strong>fill the frame</strong> with the surface.',
        '<strong>Sharp focus</strong> and fine detail carry texture.'
      ]
    },
    {
      key: 'pattern', num: 9, name: 'Pattern', short: 'Pattern',
      demo: 'pattern',
      lede: 'Pattern is repetition: shapes, lines, colors or forms that recur at regular intervals and create rhythm. Repetition pleases the eye, and a single break in the pattern instantly becomes the subject.',
      points: [
        '<strong>Fill the frame</strong> so the pattern seems to continue beyond the edges.',
        'Shoot <strong>straight on or straight down</strong> to keep the rhythm regular.',
        'Look for <strong>the odd one out</strong>. The break gives the pattern a center of interest.'
      ]
    },
    {
      key: 'simplicity', num: 10, name: 'Simplicity', short: 'Simplicity',
      demo: 'simplicity',
      lede: 'Clutter distracts from the main elements and makes the subject hard to find. By removing extraneous content, a photographer makes sure the viewer goes straight to what matters. Less in the frame means more attention on what is left.',
      points: [
        'Ask what each element adds. If nothing, <strong>move or reframe</strong> until it is gone.',
        'A <strong>wide aperture</strong>, like f/1.8, throws the background out of focus. This is called limiting focus.',
        'A plain background, a single color or a single tone <strong>simplifies instantly</strong>.'
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
      story: 'Coming around the far side of the Moon on their fourth orbit, the Apollo 8 crew saw Earth rise over the lunar horizon. Anders grabbed a camera loaded with color film and made the frame that nature photographer Galen Rowell called the most influential environmental photograph ever taken.',
      look: 'The lunar horizon runs along the bottom of the frame and Earth floats high and off-center, near an upper power point. The black of space around it shows how small and alone our planet is.',
      extra: 'Anders actually held the camera so the horizon ran vertically. The picture is usually printed rotated, which is a composition choice in itself.',
      tags: ['space']
    },
    {
      id: 'afghan-girl', el: 'thirds', title: 'Afghan Girl', by: 'Steve McCurry', year: '1984',
      date: '1984', place: 'Nasir Bagh refugee camp, Pakistan', camera: 'Nikon FM2, Kodachrome 64 film',
      img: { wiki: 'Afghan_Girl' }, link: 'https://en.wikipedia.org/wiki/Afghan_Girl', rights: 'c',
      story: 'McCurry photographed 12-year-old Sharbat Gula in a tent used as a schoolroom at a camp for Afghan refugees. The portrait ran on the June 1985 cover of National Geographic, which calls it its most recognized photograph. Her name stayed unknown until McCurry found her again in 2002.',
      look: 'Her eyes sit along the upper third line, the strongest place in the frame for a gaze. Their sea-green color repeats in the background and contrasts with her red shawl, so color pulls you straight back to them.',
      tags: ['light']
    },
    {
      id: 'moonrise', el: 'thirds', title: 'Moonrise, Hernandez, New Mexico', by: 'Ansel Adams', year: '1941',
      date: 'November 1, 1941', place: 'Hernandez, New Mexico', camera: '8×10 view camera',
      img: { wiki: 'Moonrise,_Hernandez,_New_Mexico' }, link: 'https://en.wikipedia.org/wiki/Moonrise,_Hernandez,_New_Mexico', rights: 'c',
      story: 'Driving past Hernandez at dusk, Adams pulled over, set up his camera on the car and could not find his light meter. Knowing how bright the moon was, he worked out the exposure in his head. He made one exposure, and before he could make a second the sunlight left the white crosses of the cemetery.',
      look: 'The village and mountains form a band across the lower third, and the dark sky fills the two-thirds above. The moon hangs high in the upper third, small but impossible to miss against all that black.',
      tags: ['light', 'space']
    },

    /* 02 Framing */
    {
      id: 'clearing-storm', el: 'framing', title: 'Clearing Winter Storm, Yosemite National Park', by: 'Ansel Adams', year: 'c. 1937',
      date: 'c. 1937', place: 'Yosemite Valley, California', camera: 'Large-format view camera',
      img: { wiki: 'Clearing_Winter_Storm,_Yosemite_National_Park' }, link: 'https://en.wikipedia.org/wiki/Clearing_Winter_Storm,_Yosemite_National_Park', rights: 'c',
      story: 'Adams photographed Yosemite Valley as a winter storm was lifting and rain was turning to snow. It became the most famous picture he made in the park, and he kept printing it for decades.',
      look: 'El Capitan on the left and Bridalveil Fall with Cathedral Rocks on the right close in like stage curtains, framing the valley. Forest, cliffs, cloud and distant Half Dome stack from foreground to background and give the print enormous depth.',
      tags: ['light']
    },
    {
      id: 'migrant-mother', el: 'framing', title: 'Migrant Mother', by: 'Dorothea Lange', org: 'Resettlement Administration', year: '1936',
      date: 'March 1936', place: 'Nipomo, California', camera: 'Graflex camera',
      img: { file: 'Lange-MigrantMother02.jpg', wiki: 'Migrant_Mother' }, link: 'https://en.wikipedia.org/wiki/Migrant_Mother', rights: 'pd',
      story: 'Lange stopped at a pea pickers’ camp in the rain and photographed Florence Owens Thompson, 32, with her children. She made a short series of frames, moving closer each time. The final frame became the defining image of the Great Depression.',
      look: 'Lange chose a close viewpoint that leaves out the camp. The two children turn their faces away and lean on their mother’s shoulders, forming a living frame around her worried face, and her hand at her chin points the eye exactly there.',
      tags: ['texture']
    },
    {
      id: 'lunch-skyscraper', el: 'framing', title: 'Lunch atop a Skyscraper', by: 'Unknown (attributed to Charles C. Ebbets)', year: '1932',
      date: 'September 20, 1932', place: 'RCA Building, Rockefeller Center, New York',
      img: { wiki: 'Lunch_atop_a_Skyscraper' }, link: 'https://en.wikipedia.org/wiki/Lunch_atop_a_Skyscraper', rights: 'c',
      story: 'Eleven ironworkers eat lunch on a steel beam on the 69th floor of the RCA Building, about 840 feet above Manhattan. It was a staged publicity photo for Rockefeller Center, and it ran in the New York Herald Tribune that October. The photographer has never been confirmed.',
      look: 'The camera is level with the beam, so we sit up there with the men. The city and Central Park drop away far below, and the jump from a sharp foreground to a hazy distance creates the stomach-turning depth.',
      tags: ['lines', 'pattern']
    },

    /* 03 Light and Shadows */
    {
      id: 'roaring-lion', el: 'light', title: 'The Roaring Lion', by: 'Yousuf Karsh', year: '1941',
      date: 'December 30, 1941', place: 'Speaker’s Chamber, Parliament of Canada, Ottawa', camera: 'Large-format camera, studio lights',
      img: { file: 'Sir Winston Churchill - 19086236948.jpg', wiki: 'The_Roaring_Lion' }, link: 'https://en.wikipedia.org/wiki/The_Roaring_Lion', rights: 'pd',
      story: 'Karsh had two minutes with Winston Churchill after a speech to the Canadian Parliament. Churchill would not put down his cigar, so Karsh stepped forward and took it out of his mouth. The scowl that followed became the face of British defiance in the Second World War.',
      look: 'A strong light from the side and above carves Churchill’s face out of a dark background, while a second light rims his shoulders. The dramatic contrast, like a Rembrandt painting, turns a portrait into a monument.',
      tags: ['form']
    },
    {
      id: 'wall-street', el: 'light', title: 'Wall Street', by: 'Paul Strand', year: '1915',
      date: '1915', place: 'Wall Street, New York',
      img: { file: 'Wall Street by Paul Strand, 1915.jpg', wiki: 'Wall_Street_(photograph)' }, link: 'https://en.wikipedia.org/wiki/Wall_Street_(photograph)', rights: 'pd',
      story: 'Strand set up on the steps of Federal Hall during the morning rush and pointed his camera at the J. P. Morgan & Co. building. Alfred Stieglitz published the picture in his magazine Camera Work, and it became one of the first truly modern photographs.',
      look: 'Low morning sun rakes along the street and stretches each walker’s shadow into a long diagonal. The building’s huge windows read as black voids, and the light makes the people tiny against the power of the bank.',
      tags: ['pattern', 'lines']
    },
    {
      id: 'flatiron', el: 'light', title: 'The Flatiron', by: 'Edward Steichen', year: '1904',
      date: '1904 (printed 1904–1909)', place: 'Madison Square, New York', camera: 'Gum bichromate over platinum prints',
      img: { wiki: 'The_Flatiron_(photograph)' }, link: 'https://en.wikipedia.org/wiki/The_Flatiron_(photograph)', rights: 'pd',
      story: 'Steichen photographed the new Flatiron Building at twilight, then made three large prints by hand, each toned a different color. The Metropolitan Museum of Art holds all three versions.',
      look: 'Backlit by the evening sky, the tree branch and the carriages become dark silhouettes while haze softens the building into a ghost. The light builds depth in layers: dark foreground, gray middle, pale distance.',
      tags: ['framing', 'shape']
    },

    /* 04 Lines */
    {
      id: 'tetons', el: 'lines', title: 'The Tetons and the Snake River', by: 'Ansel Adams', org: 'National Park Service', year: '1942',
      date: '1942', place: 'Grand Teton National Park, Wyoming',
      img: { file: 'Adams The Tetons and the Snake River.jpg' }, link: 'https://en.wikipedia.org/wiki/The_Tetons_and_the_Snake_River', rights: 'pd',
      story: 'Adams made this view for a National Park Service mural project. In 1977 it was chosen for the Voyager Golden Record, which carried pictures of Earth out of the solar system.',
      look: 'The Snake River makes a great S-curve that carries the eye from the dark foreground into the picture and up to the jagged line of peaks. The curve gives the landscape flow, and the ridge closes it at the top.',
      tags: ['light']
    },
    {
      id: 'steerage', el: 'lines', title: 'The Steerage', by: 'Alfred Stieglitz', year: '1907',
      date: '1907', place: 'Aboard the SS Kaiser Wilhelm II', camera: 'Hand camera, 4×5 glass plate',
      img: { wiki: 'The_Steerage', file: 'The Steerage 1907 Stieglitz.jpg' }, link: 'https://en.wikipedia.org/wiki/The_Steerage', rights: 'pd',
      story: 'Sailing to Europe in first class, Stieglitz walked to the end of the deck and looked down at the steerage passengers below. He ran back for his camera, sure that he was looking at a picture of shapes related to each other. He later said that if he could be represented by only one photograph, he would choose this one.',
      look: 'The white gangway cuts a hard diagonal across the frame and splits the upper deck from the lower. A leaning funnel, a slanted ladder, a vertical mast and chains all act as lines that pull the eye between the two worlds.',
      tags: ['shape', 'framing']
    },
    {
      id: 'iwo-jima', el: 'lines', title: 'Raising the Flag on Iwo Jima', by: 'Joe Rosenthal', org: 'Associated Press', year: '1945',
      date: 'February 23, 1945', place: 'Mount Suribachi, Iwo Jima', camera: 'Speed Graphic',
      img: { wiki: 'Raising_the_Flag_on_Iwo_Jima' }, link: 'https://en.wikipedia.org/wiki/Raising_the_Flag_on_Iwo_Jima', rights: 'c',
      story: 'Five days into the battle, six Marines raised a second, larger flag on Mount Suribachi. Rosenthal swung up his Speed Graphic and shot with no time to compose. The photograph won the 1945 Pulitzer Prize for Photography.',
      look: 'The flagpole makes one powerful diagonal through the frame, and the Marines’ bodies lean along it. A diagonal is the most dynamic line in composition, so the frozen moment still feels like effort and motion.',
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
      story: 'Cartier-Bresson poked his Leica through a gap in a fence behind the Saint-Lazare station and caught a man leaping over a flooded yard. It is the classic example of what he called the decisive moment. The frame is cut off on the left because the gap in the planks was too narrow for his lens.',
      look: 'The leaping man is a pure black silhouette, and the water repeats his shape in reflection. Posters on the wall behind him show a dancer in nearly the same leap, while ripples and a ladder add circles and lines.',
      tags: ['pattern']
    },
    {
      id: 'milk-drop', el: 'shape', title: 'Milk Drop Coronet', by: 'Harold Edgerton', year: '1957',
      date: 'January 10, 1957', place: 'MIT, Cambridge, Massachusetts', camera: 'Electronic strobe flash, about 1/1,000,000 s',
      img: { wiki: 'Milk_Drop_Coronet' }, link: 'https://en.wikipedia.org/wiki/Milk_Drop_Coronet', rights: 'c',
      story: 'Edgerton, an MIT engineer, developed the electronic strobe flash. A falling drop of milk broke a beam of light and fired a flash lasting about a millionth of a second, freezing a splash no human eye had ever seen.',
      look: 'The splash forms a near-perfect crown: a ring of evenly spaced points with a bead at each tip, set against a plain background. With nothing else in the frame, the shape is the whole picture.',
      tags: ['simplicity', 'pattern']
    },

    /* 06 Form */
    {
      id: 'pepper', el: 'form', title: 'Pepper No. 30', by: 'Edward Weston', year: '1930',
      date: '1930', place: 'Carmel, California', camera: '8×10 view camera',
      img: { file: 'Pepper No. 30.jpg', wiki: 'Pepper_No._30' }, link: 'https://en.wikipedia.org/wiki/Pepper_No._30', rights: 'c',
      story: 'Weston photographed dozens of peppers in the summer of 1930. For this one he set the pepper inside a tin funnel, which bounced soft light all around it. In his daybook he called it “a pepper — but more than a pepper: abstract.”',
      look: 'Soft light wraps around every fold, so tones roll smoothly from bright highlight to deep shadow. That gradation makes the pepper look solid and sculptural, like a torso carved in stone.',
      tags: ['simplicity', 'light']
    },
    {
      id: 'nautilus', el: 'form', title: 'Nautilus', by: 'Edward Weston', year: '1927',
      date: '1927', place: 'Glendale, California', camera: '8×10 view camera, exposure of several hours',
      img: { wiki: 'Nautilus_(photograph)' }, link: 'https://en.wikipedia.org/wiki/Nautilus_(photograph)', rights: 'c',
      story: 'After seeing seashell paintings by his friend Henrietta Shore, Weston began photographing shells himself. He stood a nautilus shell on end against a dark backdrop for an exposure lasting hours, fighting tiny vibrations the whole time.',
      look: 'Light falls across the spiral so the shell glows from pale to dark as it curves away from us. Against the black background there is no context at all, only volume.',
      tags: ['simplicity', 'shape']
    },
    {
      id: 'mechanic', el: 'form', title: 'Power House Mechanic Working on Steam Pump', by: 'Lewis Hine', year: '1920',
      date: '1920', place: 'United States',
      img: { file: 'Lewis Hine Power house mechanic working on steam pump.jpg' }, link: 'https://www.archives.gov/exhibits/picturing_the_century/port_hine/port_hine_img22.html', rights: 'pd',
      story: 'Hine first used his camera to expose child labor in American mills and mines. In the 1920s he turned to what he called “work portraits,” honoring the skill and strength of industrial workers. This mechanic tightening a nut on a steam pump is the most famous of them.',
      look: 'Directional light picks out the muscles of the arms and back, giving the body weight and roundness. The curve of his body echoes the curves of the machine, so man and machine read as one sculpture.',
      tags: ['shape', 'light']
    },

    /* 07 Positive & Negative Space */
    {
      id: 'pale-blue-dot', el: 'space', title: 'Pale Blue Dot', by: 'Voyager 1', org: 'NASA, at the request of Carl Sagan', year: '1990',
      date: 'February 14, 1990', place: 'About 3.7 billion miles from the Sun',
      img: { file: 'PIA23645-Earth-PaleBlueDot-6Bkm-Voyager1-orig19900214-upd20200212.jpg', wiki: 'Pale_Blue_Dot' }, link: 'https://en.wikipedia.org/wiki/Pale_Blue_Dot', rights: 'pd',
      story: 'At Carl Sagan’s urging, NASA turned Voyager 1 around to photograph the planets it had passed. In this frame, Earth takes up less than a single pixel. Sagan later wrote: “Look again at that dot. That’s here. That’s home. That’s us.”',
      look: 'Almost the entire frame is negative space, crossed by bands of scattered sunlight. The tiny positive space, Earth, matters precisely because it is surrounded by so much emptiness.',
      tags: ['simplicity']
    },
    {
      id: 'tank-man', el: 'space', title: 'Tank Man', by: 'Jeff Widener', org: 'Associated Press', year: '1989',
      date: 'June 5, 1989', place: 'Chang’an Avenue, Beijing', camera: 'Telephoto lens from a sixth-floor balcony',
      img: { wiki: 'Tank_Man' }, link: 'https://en.wikipedia.org/wiki/Tank_Man', rights: 'c',
      story: 'The day after the Tiananmen Square crackdown, a man carrying shopping bags stepped in front of a column of tanks. Widener photographed him from a balcony of the Beijing Hotel, about half a mile away. The man’s identity is still unknown.',
      look: 'The empty road around the lone figure is what gives the picture its force. All that negative space makes him small and vulnerable, and the row of tanks feels even heavier against it.',
      tags: ['framing', 'pattern']
    },
    {
      id: 'mccandless', el: 'space', title: 'Bruce McCandless II, First Untethered Spacewalk', by: 'NASA', org: 'Space Shuttle Challenger, STS-41-B', year: '1984',
      date: 'February 1984', place: 'Earth orbit',
      img: { file: 'Bruce McCandless II during EVA in 1984.jpg' }, link: 'https://en.wikipedia.org/wiki/Bruce_McCandless_II', rights: 'pd',
      story: 'Bruce McCandless II became the first person to fly free in space, untethered from any spacecraft, using a nitrogen-jet backpack called the Manned Maneuvering Unit. He drifted about 100 meters from the shuttle Challenger.',
      look: 'One figure floats in the black of space with nothing to hold on to. The negative space is so vast that it becomes the feeling of the image: freedom and isolation at once.',
      tags: ['simplicity']
    },

    /* 08 Texture */
    {
      id: 'bootprint', el: 'texture', title: 'Apollo 11 Bootprint', by: 'Buzz Aldrin', org: 'NASA, Apollo 11', year: '1969',
      date: 'July 20, 1969', place: 'Sea of Tranquility, the Moon', camera: 'Hasselblad camera',
      img: { file: 'Apollo 11 bootprint.jpg' }, link: 'https://en.wikipedia.org/wiki/Apollo_11', rights: 'pd',
      story: 'Aldrin photographed his own bootprint as part of a study of the lunar soil, to see how the fine dust held a shape. It became one of the defining images of the first Moon landing.',
      look: 'The Moon landing was timed for a low Sun, so light rakes across the ground and every ridge of the boot tread throws a tiny shadow. You can almost feel the powdery, packed soil.',
      tags: ['light', 'pattern']
    },
    {
      id: 'floyd-burroughs', el: 'texture', title: 'Floyd Burroughs, Cotton Sharecropper', by: 'Walker Evans', year: '1936',
      date: '1936', place: 'Hale County, Alabama', camera: '8×10 view camera',
      img: { file: 'Floyd Burroughs, cotton sharecropper. Hale County, Alabama LOC 3549662506.jpg' }, link: 'https://en.wikipedia.org/wiki/Let_Us_Now_Praise_Famous_Men', rights: 'pd',
      story: 'On assignment with the writer James Agee, Evans spent the summer of 1936 with three sharecropper families in Alabama. The work became the book Let Us Now Praise Famous Men (1941). Floyd Burroughs was one of the farmers.',
      look: 'Made with a large view camera, the picture records every thread of the frayed clothes and every line of a sun-worn face. Texture tells the story of hard work without a single word.',
      tags: ['form']
    },
    {
      id: 'skull', el: 'texture', title: 'Skull, Badlands, South Dakota', by: 'Arthur Rothstein', org: 'Farm Security Administration', year: '1936',
      date: 'May 1936', place: 'Badlands, South Dakota',
      img: { search: 'Rothstein bleached skull steer sun-baked earth South Dakota' }, link: 'https://en.wikipedia.org/wiki/Arthur_Rothstein', rights: 'pd',
      story: 'Photographing the drought for the Farm Security Administration, Rothstein found a bleached steer skull and photographed it in several spots, moving it onto cracked, dry ground. When newspapers learned it had been moved, critics called the picture a fake, one of the first public arguments about staging in documentary photography.',
      look: 'Sunlight on the cracked earth sets its rough, broken surface against the smooth, chalky bone. Two opposite textures side by side make each one stronger.',
      tags: ['light', 'shape']
    },

    /* 09 Pattern */
    {
      id: '99-cent', el: 'pattern', title: '99 Cent', by: 'Andreas Gursky', year: '1999',
      date: '1999', place: 'Los Angeles', camera: 'Large-format camera, digitally assembled',
      img: { wiki: '99_Cent_(photograph)' }, link: 'https://en.wikipedia.org/wiki/99_Cent_(photograph)', rights: 'c',
      story: 'Gursky photographed the inside of a discount store in Los Angeles and digitally adjusted the picture so that it is sharper and more even than any eye could see. Prints of it and its 2001 diptych version set auction records for photography.',
      look: 'Rows of brightly packaged goods repeat across the entire frame, and the shiny ceiling repeats them again. Because the pattern fills the frame from edge to edge, it seems to go on forever.',
      tags: ['lines']
    },
    {
      id: 'horse', el: 'pattern', title: 'The Horse in Motion', by: 'Eadweard Muybridge', year: '1878',
      date: 'June 1878', place: 'Palo Alto, California', camera: 'A row of cameras triggered as the horse ran past',
      img: { file: 'The Horse in Motion high res.jpg', wiki: 'The_Horse_in_Motion' }, link: 'https://en.wikipedia.org/wiki/The_Horse_in_Motion', rights: 'pd',
      story: 'Leland Stanford wanted to know whether a galloping horse ever has all four hooves off the ground. Muybridge lined up cameras along the track and fired them one after another as the horse passed. The frames proved that it does, and the sequence was a step toward motion pictures.',
      look: 'The grid repeats the same horse and rider again and again with small changes. Repetition with variation creates a rhythm you can read almost like music.',
      tags: ['shape']
    },
    {
      id: 'abbey-road', el: 'pattern', title: 'Abbey Road', by: 'Iain Macmillan', year: '1969',
      date: 'August 8, 1969', place: 'Abbey Road, London', camera: 'Hasselblad, from a stepladder',
      img: { wiki: 'Abbey_Road_(album)' }, link: 'https://en.wikipedia.org/wiki/Abbey_Road', rights: 'c',
      story: 'On the morning of August 8, 1969, Macmillan stood on a stepladder in the middle of the road while a police officer held up traffic. In about ten minutes he made six frames as the Beatles walked back and forth across the zebra crossing. The fifth, the only frame with all four men in step, became the album cover.',
      look: 'Four figures in matching stride repeat across the frame like notes in a bar of music, and the stripes of the crossing repeat beneath them. The rhythm is strong enough to work as a pattern.',
      tags: ['lines']
    },

    /* 10 Simplicity */
    {
      id: 'rhein-ii', el: 'simplicity', title: 'Rhein II', by: 'Andreas Gursky', year: '1999',
      date: '1999', place: 'The Lower Rhine near Düsseldorf, Germany',
      img: { wiki: 'Rhein_II' }, link: 'https://en.wikipedia.org/wiki/Rhein_II', rights: 'c',
      story: 'Gursky digitally removed dog walkers and a factory building from the riverbank, leaving nothing but grass, water and sky. In 2011 a print sold for $4.3 million, at the time the highest price ever paid for a photograph.',
      look: 'The picture is reduced to horizontal bands: grass, path, river, grass, sky. With nothing to distract, the eye rests on the stripes themselves and an ordinary river becomes almost abstract.',
      tags: ['lines']
    },
    {
      id: 'bliss', el: 'simplicity', title: 'Bliss', by: 'Charles O’Rear', year: '1996',
      date: 'January 1996', place: 'Sonoma County, California', camera: 'Mamiya RZ67, Fujifilm Velvia film',
      img: { wiki: 'Bliss_(photograph)' }, link: 'https://en.wikipedia.org/wiki/Bliss_(photograph)', rights: 'c',
      story: 'Driving through California wine country after winter rains, O’Rear stopped to photograph a green hill under a blue sky. Microsoft bought the picture, and as the default Windows XP wallpaper it may be the most viewed photograph in history.',
      look: 'One hill, one sky, a few clouds. The curve of the hill sits low in the frame and there is nothing else to look at, which is exactly why it works as a calm background on a billion screens.',
      tags: ['lines']
    },
    {
      id: 'equivalents', el: 'simplicity', title: 'Equivalent', by: 'Alfred Stieglitz', year: '1925–1934',
      date: '1925–1934 (series)', place: 'Lake George, New York',
      img: { wiki: 'Equivalents' }, link: 'https://en.wikipedia.org/wiki/Equivalents', rights: 'c',
      story: 'Stieglitz made more than 220 photographs of clouds and called them Equivalents. With no horizon and no ground, they are among the first photographs meant to be seen as pure abstraction: images that stand for feelings instead of things.',
      look: 'Only sky and cloud remain, so the picture is about tone, shape and light alone. Removing every point of reference strips the image down to its simplest parts.',
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
