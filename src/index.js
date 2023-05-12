console.log("Script is running")

//
//  Pedestal
//


let identitiyArray = new Float32Array(16);
let identityMatrix = glMatrix.mat4.identity(identitiyArray);

let topCubeWMatx = new Float32Array(16);
let botCubeWMatx = new Float32Array(16);
let leftCubeWMatx = new Float32Array(16);
let rightCubeWMatx = new Float32Array(16);

let topCubeWMatxStart = new Float32Array(16);
let botCubeWMatxStart = new Float32Array(16);
let leftCubeWMatxStart = new Float32Array(16);
let rightCubeWMatxStart = new Float32Array(16);

let leftRad = 2;
let rightRad = 2;

let rotAngle = 5;
let currentPositionAngle = 0;
let currentRotationAngle = 0;
let currentCenterAngle = 0;

let posX = 0;
let posY = -2;
let posZ = 2;

let norm = 2;

glMatrix.mat4.translate(topCubeWMatx, identityMatrix, [0 + posX, 2 + posY, 0 + posZ]);
glMatrix.mat4.translate(topCubeWMatxStart, identityMatrix, [0 + posX, 2 + posY, 0 + posZ]);

glMatrix.mat4.translate(botCubeWMatx, identityMatrix, [0 + posX, 0 + posY, 0 + posZ]);
glMatrix.mat4.translate(botCubeWMatxStart, identityMatrix, [0 + posX, 0 + posY, 0 + posZ]);

glMatrix.mat4.translate(leftCubeWMatx, identityMatrix, [2 + posX, 0 + posY, 0 + posZ]);
glMatrix.mat4.translate(leftCubeWMatxStart, identityMatrix, [2 + posX, 0 + posY, 0 + posZ]);

glMatrix.mat4.translate(rightCubeWMatx, identityMatrix, [-2 + posX, 0 + posY, 0 + posZ]);
glMatrix.mat4.translate(rightCubeWMatxStart, identityMatrix, [-2 + posX, 0 + posY, 0 + posZ]);

let canvas = document.getElementById("pedestal");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

initWebGl(canvas);
console.log(gl)

//
//  Bind shader
//

let shaderProgram = initShaderProgram(gl, vsSource, fsSource);
gl.useProgram(shaderProgram);

//
//  Bind cube buffer
//

initBuffer(gl, cubeVertices, gl.ARRAY_BUFFER, Float32Array);
initBuffer(gl, cubeIndices, gl.ELEMENT_ARRAY_BUFFER, Uint16Array);

//
//  Set buffer data to attributes
//

let positionAttribLocationCube = enableVertexAttrib(
    shaderProgram,
    "vertPositions",
    3, 6, 0);
gl.enableVertexAttribArray(positionAttribLocationCube);

let colorAttribLocationCube = enableVertexAttrib(
    shaderProgram,
    "vertColor",
    3, 6, 3);
gl.enableVertexAttribArray(colorAttribLocationCube);

let matWorldLocationCube = gl.getUniformLocation(shaderProgram, "mWorld");
let matViewLocationCube = gl.getUniformLocation(shaderProgram, "mView");
let matProjLocationCube = gl.getUniformLocation(shaderProgram, "mProj");

let worldMatrixCube = new Float32Array(16);
let viewMatrixCube = new Float32Array(16);
let projMatrixCube = new Float32Array(16);

glMatrix.mat4.identity(worldMatrixCube)
glMatrix.mat4.lookAt(viewMatrixCube, [0, 0, -20], [0, 0, 0], [0, 1, 0]);
glMatrix.mat4.perspective(projMatrixCube, getRadAngle(45), canvas.width / canvas.height, 0.1, 1000.0);

gl.uniformMatrix4fv(matWorldLocationCube, false, worldMatrixCube);
gl.uniformMatrix4fv(matViewLocationCube, false, viewMatrixCube);
gl.uniformMatrix4fv(matProjLocationCube, false, projMatrixCube);

gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

function getCenterRadiusY(matrix)
{
    return Math.sqrt(Math.pow(matrix[12], 2) + Math.pow(matrix[14], 2))
}

function getCurrentAngleRelativelyMatrix(matrix, point)
{
    x = matrix[12] - point[0]
    y = matrix[13] - point[1]
    z = matrix[14] - point[2]

    let a = Math.atan2(x, z) * ( 180 / Math.PI )
    return a
}

function getTranslationVec3(rad, angle, posX, posY, posZ)
{
    return [rad * Math.cos(getRadAngle(angle)) + posX, 0 + posY, rad * Math.sin(getRadAngle(angle)) + posZ]
}

currentRotationAngle = getCurrentAngleRelativelyMatrix(leftCubeWMatx, [botCubeWMatx[12], botCubeWMatx[13], botCubeWMatxStart[14]])
let currentCubeAngle = 0
let kek = 0;
document.addEventListener('keydown', (event) => {
    let name = event.key;
    let code = event.code;

    function rotateWholePedestal(rotAngle)
    {
        glMatrix.mat4.rotate(topCubeWMatx, topCubeWMatx, getRadAngle(rotAngle), [0, 1, 0]);
        glMatrix.mat4.rotate(botCubeWMatx, botCubeWMatx, getRadAngle(rotAngle), [0, 1, 0]);

        glMatrix.mat4.copy(leftCubeWMatx, botCubeWMatx);
        glMatrix.mat4.translate(leftCubeWMatx, leftCubeWMatx, getTranslationVec3(2, 0 + currentCubeAngle, 0, 0, 0))

        glMatrix.mat4.copy(rightCubeWMatx, botCubeWMatx);
        glMatrix.mat4.translate(rightCubeWMatx, rightCubeWMatx, getTranslationVec3(2, 180 + currentCubeAngle , 0, 0, 0))
        console.log(getCurrentAngleRelativelyMatrix(leftCubeWMatx, botCubeWMatx))
        console.log(getCurrentAngleRelativelyMatrix(rightCubeWMatx, botCubeWMatx))
    }

    function rotateEachCube(rotAngle)
    {
        glMatrix.mat4.rotate(topCubeWMatx, topCubeWMatx, getRadAngle(rotAngle), [0, 1, 0]);
        glMatrix.mat4.rotate(botCubeWMatx, botCubeWMatx, getRadAngle(rotAngle), [0, 1, 0]);
        glMatrix.mat4.rotate(leftCubeWMatx, leftCubeWMatx, getRadAngle(rotAngle), [0, 1, 0]);
        glMatrix.mat4.rotate(rightCubeWMatx, rightCubeWMatx, getRadAngle(rotAngle), [0, 1, 0]);
    }


    function rotateAroundOy(rotAngle)
    {
        a = getCurrentAngleRelativelyMatrix(botCubeWMatx, [0,0,0])
        r = getCenterRadiusY(botCubeWMatx)
        kek = kek + rotAngle
        newCoordinates = getTranslationVec3(r, kek, 0, 0, 0)
        console.log(newCoordinates)
        //move = [newCoordinates[0] - botCubeWMatx[12], 0, newCoordinates[2] - botCubeWMatx[14]]
        //console.log(botCubeWMatx[12], botCubeWMatx[13], botCubeWMatx[14], move, newCoordinates)
        //glMatrix.mat4.translate(botCubeWMatx, botCubeWMatx, move)
    }

    if (name == "w")
    {
        rotateWholePedestal(-rotAngle);

    }
    if (name == "e")
    {
        rotateWholePedestal(rotAngle);
    }
    if (name == "s")
    {
        currentCubeAngle += rotAngle
        rotateEachCube(rotAngle)
    }
    if (name == "d")
    {
        currentCubeAngle -= rotAngle
        rotateEachCube(-rotAngle)
    }

    if (name == "x")
    {
        rotateAroundOy(rotAngle)
    }
    if (name == "c")
    {

    }
    console.log(`Key pressed ${name} \r\n Key code value: ${code}`);
}, false);



let loop = () =>

{
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    glMatrix.mat4.copy(worldMatrixCube, topCubeWMatx);
    gl.uniformMatrix4fv(matWorldLocationCube, false, worldMatrixCube);
    gl.drawElements(gl.TRIANGLES, cubeIndices.length, gl.UNSIGNED_SHORT, 0);

    glMatrix.mat4.copy(worldMatrixCube, botCubeWMatx);
    gl.uniformMatrix4fv(matWorldLocationCube, false, worldMatrixCube);
    gl.drawElements(gl.TRIANGLES, cubeIndices.length, gl.UNSIGNED_SHORT, 0);

    glMatrix.mat4.copy(worldMatrixCube, leftCubeWMatx);
    gl.uniformMatrix4fv(matWorldLocationCube, false, worldMatrixCube);
    gl.drawElements(gl.TRIANGLES, cubeIndices.length, gl.UNSIGNED_SHORT, 0);

    glMatrix.mat4.copy(worldMatrixCube, rightCubeWMatx);
    gl.uniformMatrix4fv(matWorldLocationCube, false, worldMatrixCube);
    gl.drawElements(gl.TRIANGLES, cubeIndices.length, gl.UNSIGNED_SHORT, 0);
    requestAnimationFrame(loop);
}
requestAnimationFrame(loop);
