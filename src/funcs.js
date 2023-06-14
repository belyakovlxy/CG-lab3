
let gl = null;


function toFloatColor(intColor)
{
    if (intColor < 0)
        return 0.0;
    else if (intColor > 255)
        return 1.0;
    else
        return  intColor / 255;
}

function getNormalMatrix(ModelMatrix)
{
    let normalMatrix = glMatrix.mat4.create();
    glMatrix.mat4.invert(normalMatrix, ModelMatrix);
    glMatrix.mat4.transpose(normalMatrix, normalMatrix);
    return normalMatrix;
}

function getNormalByPoints(x1, y1, z1, x2, y2, z2, x3, y3, z3)
{
    let AB = glMatrix.vec3.fromValues(x1 - x2, y1 - y2, z1 - z2);
    let BC = glMatrix.vec3.fromValues(x3 - x2, y3 - y2, z3 - z2);

    let normal = glMatrix.vec3.create();
    glMatrix.vec3.cross(normal, AB, BC);
    glMatrix.vec3.normalize(normal, normal);

    return normal;
}

function initWebGl(canvas)
{
    gl = canvas.getContext("webgl");

    if (!gl)
    {
        console.log("WebGL not supported")
        gl = canvas.getContext("experimental-webgl");
    }

    if (!gl)
    {
        alert("Your browser does not support WebGL");
    }

    gl.clearColor(1, 0.85, 0.85, 1);
    gl.enable(gl.DEPTH_TEST);
    //gl.enable(gl.CULL_FACE);
    gl.depthFunc(gl.LEQUAL);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
}

function loadShader(gl, type, source)
{
    let shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error("Error! Shader compile status ", gl.getShaderInfoLog(shader));
        return;
    }
    return shader;
}

function initShaderProgram(gl, vsSource, fsSource)
{
    const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource);
    const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource);

    const shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);

    gl.linkProgram(shaderProgram);
    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS))
    {
        console.error("Error! Link program", gl.getProgramInfoLog(shaderProgram));
        return;
    }

    gl.validateProgram(shaderProgram)
    if (!gl.getProgramParameter(shaderProgram, gl.VALIDATE_STATUS))
    {
        console.error("Error! validate program", gl.getProgramInfoLog(shaderProgram));
        return;
    }

    return shaderProgram;
}

function initBuffer(gl, buffer, arrType, dataType)
{
    let BufferObject = gl.createBuffer();
    gl.bindBuffer(arrType, BufferObject);
    gl.bufferData(arrType, new dataType(buffer), gl.STATIC_DRAW);
}

function enableVertexAttrib(shaderProgram, attributeName, size, stride, offset)
{
    let attribLocation = gl.getAttribLocation(shaderProgram, attributeName);
    gl.vertexAttribPointer(
        attribLocation,
        size,
        gl.FLOAT,
        false,
        stride * Float32Array.BYTES_PER_ELEMENT,
        offset * Float32Array.BYTES_PER_ELEMENT
    );

    return attribLocation;
}