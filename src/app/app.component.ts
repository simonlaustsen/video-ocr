import { Component, AfterViewInit } from '@angular/core';

declare const Tesseract: any;


@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit {
    constraints = {
        video: {
            width: {
                min: 1280,
                ideal: 1920,
                max: 2560,
            },
            height: {
                min: 720,
                ideal: 1080,
                max: 1440
            }
        }
    };

    async ngAfterViewInit() {
        if ('mediaDevices' in navigator && 'getUserMedia' in navigator.mediaDevices) {
            // getCameraSelection
            const cameraOptions: any = document.querySelector('.video-options>select');
            const devices = await navigator.mediaDevices.enumerateDevices();
            const videoDevices = devices.filter(device => device.kind === 'videoinput');
            const options = videoDevices.map(videoDevice => {
                return `<option value="${videoDevice.deviceId}">${videoDevice.label}</option>`;
            });
            cameraOptions.innerHTML = options.join('');

            const updatedConstraints = {
                ...this.constraints,
                deviceId: {
                    exact: cameraOptions.value
                }
            }
            const stream: MediaStream = await navigator.mediaDevices.getUserMedia(updatedConstraints)
            this.handleStream(stream);
        }

    }

    handleStream(stream) {
        const video = document.querySelector('video');
        video.srcObject = stream;
    }

    recognize() {
        const video = document.querySelector('video');
        const c = document.createElement('canvas');
        c.width = 640;
        c.height = 360;
        c.getContext('2d').drawImage(video, 0, 0, 640, 360);
        Tesseract.recognize(
            c,
            'eng',
            // { logger: m => console.log(m) }
        )
            .then(({ data: { text } }) => {
                console.log(text);
            })
    }
}
