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

let rotAngle = 5;
let currentRotationAngle = 0;

let posX = 0;
let posY = -2;
let posZ = 2;

let sourceStep = 1.0;
let sourceColorStep = 0.05;

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
    3, 9, 0);
gl.enableVertexAttribArray(positionAttribLocationCube);

let colorAttribLocationCube = enableVertexAttrib(
    shaderProgram,
    "vertColor",
    3, 9, 3);
gl.enableVertexAttribArray(colorAttribLocationCube);

let normalAttribLocationCube = enableVertexAttrib(
    shaderProgram,
    "vertNormal",
    3, 9, 6);
gl.enableVertexAttribArray(normalAttribLocationCube);






//--------------------------WORLD--VIEW--PROJECTION--MATRIСES-------------------------------

let normalMatrix;
let worldMatrixCube = new Float32Array(16);
let viewMatrixCube = new Float32Array(16);
let projMatrixCube = new Float32Array(16);

glMatrix.mat4.identity(worldMatrixCube)
glMatrix.mat4.lookAt(viewMatrixCube, [0, 0, -20], [0, 0, 0], [0, 1, 0]);
glMatrix.mat4.perspective(projMatrixCube, getRadAngle(45), canvas.width / canvas.height, 0.1, 1000.0);
normalMatrix = getNormalMatrix(worldMatrixCube);

let matWorldLocationCube = gl.getUniformLocation(shaderProgram, "mWorld");
let matViewLocationCube = gl.getUniformLocation(shaderProgram, "mView");
let matProjLocationCube = gl.getUniformLocation(shaderProgram, "mProj");
let normalmatrixLocation = gl.getUniformLocation(shaderProgram, "u_normalMatrix");

gl.uniformMatrix4fv(matWorldLocationCube, false, worldMatrixCube);
gl.uniformMatrix4fv(matViewLocationCube, false, viewMatrixCube);
gl.uniformMatrix4fv(matProjLocationCube, false, projMatrixCube);
gl.uniformMatrix4fv(normalmatrixLocation, false, normalMatrix);

//---------------------------SOURCE--SETTINGS-----------------------------------------------

let viewDirection = glMatrix.vec3.create();
let sourceDirection = glMatrix.vec3.create();
let sourceDiffuseColor = glMatrix.vec3.create();
let sourceSpecularColor = glMatrix.vec3.create();

glMatrix.vec3.transformMat4(viewDirection, viewDirection, viewMatrixCube);
glMatrix.vec3.set(sourceDirection,20.0,-1.0,-20.0);
glMatrix.vec3.set(sourceDiffuseColor, 1.0, 1.0, 1.0);
glMatrix.vec3.set(sourceSpecularColor, 1.0, 1.0, 1.0);

let viewDirectionLocation = gl.getUniformLocation(shaderProgram, "u_viewDirection");
let sourceDirectionLocation = gl.getUniformLocation(shaderProgram, "u_sourceDirection");
let sourceDiffuseColorLocation = gl.getUniformLocation(shaderProgram, "u_sourceDiffuseColor");
let sourceSpecularColorLocation = gl.getUniformLocation(shaderProgram, "u_sourceSpecularColor");

gl.uniform3fv(viewDirectionLocation, viewDirection);
gl.uniform3fv(sourceDirectionLocation, sourceDirection);
gl.uniform3fv(sourceDiffuseColorLocation, sourceDiffuseColor);
gl.uniform3fv(sourceSpecularColorLocation, sourceSpecularColor);


//---------------------------COLOR--SETTINGS------------------------------------------------

let shininess = 100;
let cubeColor = glMatrix.vec3.create();

let cubeColorLocation = gl.getUniformLocation(shaderProgram, "cubeColor");
let shininessLocation = gl.getUniformLocation(shaderProgram, "u_shininess");

gl.uniform1f(shininessLocation, shininess);
gl.uniform3fv(cubeColorLocation,  cubeColor);



//-------------------------SHADING--SETTINGS-------------------------------------------------
let isPhong = true;
let isBlinn = false;
let isLambert = false;
let isGouraud = false;
let isToon = false;

let isPhongLocation = gl.getUniformLocation(shaderProgram, "u_isPhong");
let isBlinnLocation = gl.getUniformLocation(shaderProgram, "u_isBlinn");
let isLambertLocation = gl.getUniformLocation(shaderProgram, "u_isLambert");
let isGouraudLocation = gl.getUniformLocation(shaderProgram, "u_isGouraud");
let isToonLocation = gl.getUniformLocation(shaderProgram, "u_isToon");

gl.uniform1i(isPhongLocation, isPhong);
gl.uniform1i(isBlinnLocation, isBlinn);
gl.uniform1i(isLambertLocation, isLambert);
gl.uniform1i(isGouraudLocation, isGouraud);
gl.uniform1i(isToonLocation, isToon);


gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

function floor5 (number)
{
    return Math.floor(number * 100000) / 100000
}

function checkColor(color)
{
    if (color[0] > 1.0)
    {
        glMatrix.vec3.set(color, 1.0, 1.0, 1.0);
    }
    if (color[0] < 0.0)
    {
        glMatrix.vec3.set(color, 0.0, 0.0, 0.0);
    }
}

function getCenterRadiusY(matrix)
{
    return Math.floor(Math.sqrt(matrix[12] * matrix[12] + matrix[14] * matrix[14]) * 100000) / 100000;
}

function getCurrentAngleRelativelyMatrix(matrix, point)
{
    x = matrix[12] - point[0]
    y = matrix[13] - point[1]
    z = matrix[14] - point[2]

    let a = Math.atan2(z, x) * ( 180 / Math.PI )
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

    function rotateWholePedestal(rotAngle)
    {
        glMatrix.mat4.rotate(topCubeWMatx, topCubeWMatx, getRadAngle(rotAngle), [0, 1, 0]);
        glMatrix.mat4.rotate(botCubeWMatx, botCubeWMatx, getRadAngle(rotAngle), [0, 1, 0]);

        glMatrix.mat4.copy(leftCubeWMatx, botCubeWMatx);
        glMatrix.mat4.translate(leftCubeWMatx, leftCubeWMatx, getTranslationVec3(2, 0 + currentCubeAngle, 0, 0, 0))

        glMatrix.mat4.copy(rightCubeWMatx, botCubeWMatx);
        glMatrix.mat4.translate(rightCubeWMatx, rightCubeWMatx, getTranslationVec3(2, 180 + currentCubeAngle , 0, 0, 0))
    }

    function rotateEachCube(rotAngle)
    {
        glMatrix.mat4.rotate(topCubeWMatx, topCubeWMatx, getRadAngle(rotAngle), [0, 1, 0]);
        glMatrix.mat4.rotate(botCubeWMatx, botCubeWMatx, getRadAngle(rotAngle), [0, 1, 0]);
        glMatrix.mat4.rotate(leftCubeWMatx, leftCubeWMatx, getRadAngle(rotAngle), [0, 1, 0]);
        glMatrix.mat4.rotate(rightCubeWMatx, rightCubeWMatx, getRadAngle(rotAngle), [0, 1, 0]);
    }

    function rotateCubeAroundOy(cubeMatrix, rotAngle)
    {
        a = getCurrentAngleRelativelyMatrix(cubeMatrix, [0,0,0])
        r = getCenterRadiusY(cubeMatrix)

        newCoordinates = getTranslationVec3(r, a + rotAngle, 0, 0, 0)
        cubeMatrix[12] = newCoordinates[0]
        cubeMatrix[14] = newCoordinates[2]
    
        glMatrix.mat4.rotate(cubeMatrix, cubeMatrix, getRadAngle(-rotAngle), [0, 1, 0])
    }

    function rotateAroundOy(rotAngle)
    {
        rotateCubeAroundOy(botCubeWMatx, rotAngle)
        rotateCubeAroundOy(topCubeWMatx, rotAngle)
        rotateCubeAroundOy(leftCubeWMatx, rotAngle)
        rotateCubeAroundOy(rightCubeWMatx, rotAngle)
    }

    if (name == "q")
    {
        rotateWholePedestal(-rotAngle);

    }
    if (name == "w")
    {
        rotateWholePedestal(rotAngle);
    }
    if (name == "a")
    {
        currentCubeAngle += rotAngle
        rotateEachCube(rotAngle)
    }
    if (name == "s")
    {
        currentCubeAngle -= rotAngle
        rotateEachCube(-rotAngle)
    }

    if (name == "z")
    {
        rotateAroundOy(rotAngle)
    }
    if (name == "x")
    {
        rotateAroundOy(-rotAngle)
    }


    // ------------------------LIGHT-CONTROLS---------------------------------------------------------
    if (name == "[")
    {
        glMatrix.vec3.set(sourceDirection, sourceDirection[0] + sourceStep, sourceDirection[1], sourceDirection[2]);
        gl.uniform3fv(sourceDirectionLocation, sourceDirection);

        console.log(sourceDirection[0], sourceDirection[1], sourceDirection[2])
    }
    if (name == "]")
    {
        glMatrix.vec3.set(sourceDirection, sourceDirection[0] - sourceStep, sourceDirection[1], sourceDirection[2]);
        gl.uniform3fv(sourceDirectionLocation, sourceDirection);

        console.log(sourceDirection[0], sourceDirection[1], sourceDirection[2])
    }
    if (name == ";")
    {
        glMatrix.vec3.set(sourceDirection, sourceDirection[0], sourceDirection[1] + sourceStep, sourceDirection[2]);
        gl.uniform3fv(sourceDirectionLocation, sourceDirection);

        console.log(sourceDirection[0], sourceDirection[1], sourceDirection[2])
    }
    if (name == "'")
    {
        glMatrix.vec3.set(sourceDirection, sourceDirection[0], sourceDirection[1] - sourceStep, sourceDirection[2]);
        gl.uniform3fv(sourceDirectionLocation, sourceDirection);

        console.log(sourceDirection[0], sourceDirection[1], sourceDirection[2])
    }
    if (name == ".")
    {
        glMatrix.vec3.set(sourceDirection, sourceDirection[0], sourceDirection[1], sourceDirection[2] + sourceStep);
        gl.uniform3fv(sourceDirectionLocation, sourceDirection);

        console.log(sourceDirection[0], sourceDirection[1], sourceDirection[2])
    }
    if (name == "/")
    {
        glMatrix.vec3.set(sourceDirection, sourceDirection[0], sourceDirection[1], sourceDirection[2] - sourceStep);
        gl.uniform3fv(sourceDirectionLocation, sourceDirection);

        console.log(sourceDirection[0], sourceDirection[1], sourceDirection[2])
    }
    if (name == "r")
    {
        shininess++;
        console.log("shininess", shininess);
        gl.uniform1f(shininessLocation, shininess);
    }
    if (name == "t")
    {
        shininess--;
        console.log("shininess", shininess);
        gl.uniform1f(shininessLocation, shininess);
    }

    if (name == "f")
    {
        glMatrix.vec3.set(sourceDiffuseColor, sourceDiffuseColor[0] + sourceColorStep, sourceDiffuseColor[1] + sourceColorStep, sourceDiffuseColor[2] + sourceColorStep);
        checkColor(sourceDiffuseColor);
        console.log("Source Diffuse Color - ", sourceDiffuseColor[0], sourceDiffuseColor);
        gl.uniform3fv(sourceDiffuseColorLocation, sourceDiffuseColor);
    }
    if (name == "g")
    {
        glMatrix.vec3.set(sourceDiffuseColor, sourceDiffuseColor[0] - sourceColorStep, sourceDiffuseColor[1] - sourceColorStep, sourceDiffuseColor[2] - sourceColorStep);
        checkColor(sourceDiffuseColor);
        console.log("Source Diffuse Color - ", sourceDiffuseColor[0]);
        gl.uniform3fv(sourceDiffuseColorLocation, sourceDiffuseColor);
    }

    if (name == "v")
    {
        glMatrix.vec3.set(sourceSpecularColor, sourceSpecularColor[0] + sourceColorStep, sourceSpecularColor[1] + sourceColorStep, sourceSpecularColor[2] + sourceColorStep);
        checkColor(sourceSpecularColor);
        console.log("Source Specular Color - ", sourceSpecularColor[0], sourceSpecularColor);
        gl.uniform3fv(sourceSpecularColorLocation, sourceSpecularColor);
    }

    if (name == "b")
    {
        glMatrix.vec3.set(sourceSpecularColor, sourceSpecularColor[0] - sourceColorStep, sourceSpecularColor[1] - sourceColorStep, sourceSpecularColor[2] - sourceColorStep);
        checkColor(sourceSpecularColor);
        console.log("Source Specular Color - ", sourceSpecularColor[0]);
        gl.uniform3fv(sourceSpecularColorLocation, sourceSpecularColor);
    }

    // ---------------------------------------SHADING--CONTROLS---------------------------------------------

    if (name == "y")
    {
        changeShading(isPhong, isPhongLocation, "Is Phong - ")
    }

    if (name == "u")
    {
        changeShading(isBlinn, isBlinnLocation, "Is Blinn - ")
    }

    if (name == "i")
    {
        changeShading(isLambert, isLambertLocation, "Is Lambert - ")
    }

    if (name == "o")
    {
        changeShading(isGouraud, isGouraudLocation, "Is Gouraud - ")
    }

    if (name == "p")
    {
        changeShading(isToon, isToonLocation, "Is Toon - ")
    }

}, false);

function changeShading(uniform, location, text)
{
    nullShadings();
    uniform = true;
    console.log(text, uniform);
    gl.uniform1f(location, uniform);
}

function nullShadings()
{
    isPhong = false;
    gl.uniform1f(isPhongLocation, isPhong);

    isBlinn = false;
    gl.uniform1f(isBlinnLocation, isBlinn);

    isLambert = false;
    gl.uniform1f(isLambertLocation, isLambert);

    isGouraud = false;
    gl.uniform1f(isGouraudLocation, isGouraud);

    isToon = false;
    gl.uniform1f(isToonLocation, isToon);
}

let loop = () =>

{
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    glMatrix.mat4.copy(worldMatrixCube, topCubeWMatx);
    normalMatrix = getNormalMatrix(worldMatrixCube);
    gl.uniformMatrix4fv(normalmatrixLocation, false, normalMatrix);
    gl.uniformMatrix4fv(matWorldLocationCube, false, worldMatrixCube);
    glMatrix.vec3.set(cubeColor, toFloatColor(219), toFloatColor(172), toFloatColor(52))
    gl.uniform3fv(cubeColorLocation,  cubeColor);
    gl.drawElements(gl.TRIANGLES, cubeIndices.length, gl.UNSIGNED_SHORT, 0);

    glMatrix.mat4.copy(worldMatrixCube, botCubeWMatx);
    normalMatrix = getNormalMatrix(worldMatrixCube);
    gl.uniformMatrix4fv(normalmatrixLocation, false, normalMatrix);
    gl.uniformMatrix4fv(matWorldLocationCube, false, worldMatrixCube);
    gl.drawElements(gl.TRIANGLES, cubeIndices.length, gl.UNSIGNED_SHORT, 0);

    glMatrix.mat4.copy(worldMatrixCube, leftCubeWMatx);
    normalMatrix = getNormalMatrix(worldMatrixCube);
    gl.uniformMatrix4fv(normalmatrixLocation, false, normalMatrix);
    gl.uniformMatrix4fv(matWorldLocationCube, false, worldMatrixCube);
    glMatrix.vec3.set(cubeColor, toFloatColor(192), toFloatColor(192), toFloatColor(192))
    gl.uniform3fv(cubeColorLocation,  cubeColor);
    gl.drawElements(gl.TRIANGLES, cubeIndices.length, gl.UNSIGNED_SHORT, 0);

    glMatrix.mat4.copy(worldMatrixCube, rightCubeWMatx);
    normalMatrix = getNormalMatrix(worldMatrixCube);
    gl.uniformMatrix4fv(normalmatrixLocation, false, normalMatrix);
    gl.uniformMatrix4fv(matWorldLocationCube, false, worldMatrixCube);
    glMatrix.vec3.set(cubeColor, toFloatColor(205), toFloatColor(127), toFloatColor(50))
    gl.uniform3fv(cubeColorLocation,  cubeColor);
    gl.drawElements(gl.TRIANGLES, cubeIndices.length, gl.UNSIGNED_SHORT, 0);
    requestAnimationFrame(loop);
}
requestAnimationFrame(loop);
