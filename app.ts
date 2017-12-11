import $ = require("jquery")
import THREE = require("three");

$(function () {
    let $mainFrame = $("body");

    // シーン、カメラ、レンダラを生成
    let scene = new THREE.Scene();
    let camera = new THREE.PerspectiveCamera(75, $mainFrame.width() / $mainFrame.height(), 0.1, 1000);
    let renderer = new THREE.WebGLRenderer();
    renderer.setSize($mainFrame.width(), $mainFrame.height());
    camera.position.z = 5;
    camera.position.y = 1;

    // 自動生成されたcanvas要素をdivへ追加する。
    $mainFrame.append(renderer.domElement);

    // ここらへんは好きなオブジェクトをシーンに突っ込んじゃってください。
    let geometry = new THREE.BoxGeometry(1, 1, 1);
    // let material = new THREE.MeshBasicMaterial({color: 0x00ff00});
    let material = new THREE.MeshNormalMaterial();

    // Asixヘルパー
    let axisHelper = new THREE.AxisHelper(10);
    scene.add(axisHelper);

    // Gridヘルパー
    let gridHelper = new THREE.GridHelper(20, 5);
    scene.add(gridHelper);

    let cube = new THREE.Mesh(geometry, material);
    scene.add(cube);

    // コールバック関数 render をrequestAnimationFrameに渡して、
    // 繰り返し呼び出してもらう。
    let render = function () {
        window.requestAnimationFrame(render);
        cube.rotation.x += 0.01;
        cube.rotation.y += 0.01;
        renderer.render(scene, camera);
    };
    render();

    $(window).keypress(function (eventObject) {
        if ('h' == eventObject.key){
            camera.rotation.y += 0.01;
        }
        if ('l' == eventObject.key){
            camera.rotation.y -= 0.01;
        }
        if ('j' == eventObject.key){
            camera.rotation.x -= 0.01;
        }
        if ('k' == eventObject.key){
            camera.rotation.x += 0.01;
        }
    });
});
