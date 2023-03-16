const angle = (degree) =>
{
    return degree * (Math.PI / 180);
}

const deg = 72;

const pentagonVertices =
    [ // X       y   
        0.0,    0.0, 0.0,    1.0, 0.0, 0.0,
        0.0,    0.5, 0.0,    0.0, 0.0, 0.0,
        Math.cos(angle(90 + deg)) * 0.5,    Math.sin(angle(90 + deg)) * 0.5, 0.0,   0.0, 0.0, 0.0,
        Math.cos(angle(90 + 2 * deg)) * 0.5,    Math.sin(angle(90 + 2 * deg)) * 0.5, 0.0,   0.0, 0.0, 0.0,
        Math.cos(angle(90 + 3 * deg)) * 0.5,    Math.sin(angle(90 + 3 * deg)) * 0.5, 0.0,   0.0, 0.0, 0.0,
        Math.cos(angle(90 + 4 * deg)) * 0.5,    Math.sin(angle(90 + 4 * deg)) * 0.5, 0.0,   0.0, 0.0, 0.0,
        Math.cos(angle(90 + 5 * deg)) * 0.5,    Math.sin(angle(90 + 5 * deg)) * 0.5, 0.0,   0.0, 0.0, 0.0

    ];

const squareVertices =
    [
        -0.5, -0.5, 0.0,     0.2, 0.3, 0.5,
        -0.5, 0.5, 0.0,     0.2, 0.3, 0.5,
        0.5, -0.5, 0.0,     0.2, 0.3, 0.5,
        0.5, 0.5, 0.0,     0.2, 0.3, 0.5,
    ];


const cubeVertices = 
    [
    //  X   Y   Z       R   G   B
    
    //  TOP
        -1.0, 1.0, 1.0,     1.0, 0.0, 0.0,
        -1.0, 1.0, -1.0,     1.0, 0.0, 0.0,
        1.0, 1.0, -1.0,     1.0, 0.0, 0.0,
        1.0, 1.0, 1.0,     1.0, 0.0, 0.0,

    // BOTTOM        
        -1.0, -1.0, 1.0,     1.0, 0.0, 0.0,
        -1.0, -1.0, -1.0,     1.0, 0.0, 0.0,
        1.0, -1.0, -1.0,     1.0, 0.0, 0.0,
        1.0, -1.0, 1.0,     1.0, 0.0, 0.0,


    // FRONT
        -1.0, -1.0, 1.0,     0.0, 1.0, 0.0,
        -1.0, 1.0, 1.0,     0.0, 1.0, 0.0,
        1.0, 1.0, 1.0,     0.0, 1.0, 0.0,
        1.0, -1.0, 1.0,     0.0, 1.0, 0.0,

    // BACK
        -1.0, -1.0, -1.0,     0.0, 1.0, 0.0,
        -1.0, 1.0, -1.0,     0.0, 1.0, 0.0,
        1.0, 1.0, -1.0,     0.0, 1.0, 0.0,
        1.0, -1.0, -1.0,     0.0, 1.0, 0.0,

    // RIGHT
        1.0, 1.0, 1.0,     0.0, 0.0, 1.0,
        1.0, 1.0, -1.0,     0.0, 0.0, 1.0,
        1.0, -1.0, -1.0,     0.0, 0.0, 1.0,
        1.0, -1.0, 1.0,     0.0, 0.0, 1.0,

    // LEFT
        -1.0, 1.0, 1.0,     0.0, 0.0, 1.0,
        -1.0, 1.0, -1.0,     0.0, 0.0, 1.0,
        -1.0, -1.0, -1.0,     0.0, 0.0, 1.0,
        -1.0, -1.0, 1.0,     0.0, 0.0, 1.0
    ];

const cubeIndices = [
    // TOP
    0, 1, 2,
    0, 2, 3,

    // BOTTOM
    4, 5, 6,
    4, 6, 7,

    // FRONT
    8, 9, 10,
    8, 10, 11,

    // BACK
    12, 13, 14,
    12, 14, 15, 

    // RIGHT
    16, 17, 18,
    16, 18, 19,

    // LEFT
    20, 21, 22,
    20, 22, 23
];

const cubeVertices2 =
    [
        //  X   Y   Z       R   G   B

        //  TOP
        -1.0, 1.0, 1.0,     1.0, 0.0, 0.0,
        -1.0, 1.0, -1.0,     1.0, 0.0, 0.0,
        1.0, 1.0, -1.0,     1.0, 0.0, 0.0,
        1.0, 1.0, 1.0,     1.0, 0.0, 0.0,

        // BOTTOM
        -1.0, -1.0, 1.0,     1.0, 0.0, 0.0,
        -1.0, -1.0, -1.0,     1.0, 0.0, 0.0,
        1.0, -1.0, -1.0,     1.0, 0.0, 0.0,
        1.0, -1.0, 1.0,     1.0, 0.0, 0.0,


        // FRONT
        -1.0, -1.0, 1.0,     0.0, 1.0, 0.0,
        -1.0, 1.0, 1.0,     0.0, 1.0, 0.0,
        1.0, 1.0, 1.0,     0.0, 1.0, 0.0,
        1.0, -1.0, 1.0,     0.0, 1.0, 0.0,

        // BACK
        -1.0, -1.0, -1.0,     0.0, 1.0, 0.0,
        -1.0, 1.0, -1.0,     0.0, 1.0, 0.0,
        1.0, 1.0, -1.0,     0.0, 1.0, 0.0,
        1.0, -1.0, -1.0,     0.0, 1.0, 0.0,

        // RIGHT
        1.0, 1.0, 1.0,     0.0, 0.0, 1.0,
        1.0, 1.0, -1.0,     0.0, 0.0, 1.0,
        1.0, -1.0, -1.0,     0.0, 0.0, 1.0,
        1.0, -1.0, 1.0,     0.0, 0.0, 1.0,

        // LEFT
        -1.0, 1.0, 1.0,     0.0, 0.0, 1.0,
        -1.0, 1.0, -1.0,     0.0, 0.0, 1.0,
        -1.0, -1.0, -1.0,     0.0, 0.0, 1.0,
        -1.0, -1.0, 1.0,     0.0, 0.0, 1.0
    ];

const cubeIndices2 = [
    // TOP
    0, 1, 2,
    0, 2, 3,

    // BOTTOM
    4, 5, 6,
    4, 6, 7,

    // FRONT
    8, 9, 10,
    8, 10, 11,

    // BACK
    12, 13, 14,
    12, 14, 15,

    // RIGHT
    16, 17, 18,
    16, 18, 19,

    // LEFT
    20, 21, 22,
    20, 22, 23
];