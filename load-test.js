import http from 'k6/http';
import { check, sleep } from 'k6';
import { randomString, randomIntBetween } from 'https://jslib.k6.io/k6-utils/1.2.0/index.js';

export const options = {
    // 500 requests per second is the target.
    // We use 'arrival-rate' executor to strictly enforce this throughput.
    scenarios: {
        constant_request_rate: {
            executor: 'constant-arrival-rate',
            rate: 2000,
            timeUnit: '1s', // 2000 iterations per second
            duration: '10s',
            preAllocatedVUs: 500,
            maxVUs: 5000,
        },
    },
};

export default function () {
    const url = 'http://localhost:3000/api/load-test';

    // Random Data
    const payload = JSON.stringify({
        name: `User-${randomString(5)}`,
        dob: '19900101',
        model: ['S26', 'S26 Ultra', 'S26 Plus'][randomIntBetween(0, 2)],
        carrier: ['KT', 'SKT', 'LGU+', 'MVNO'][randomIntBetween(0, 3)],
    });

    const params = {
        headers: {
            'Content-Type': 'application/json',
        },
    };

    // Simulate Frontend Jitter: 1-3s delay before request
    sleep(randomIntBetween(1, 3));

    const res = http.post(url, payload, params);

    // Checks
    check(res, {
        'is status 200': (r) => r.status === 200,
        'is success or queued': (r) => {
            const body = JSON.parse(r.body);
            return body.status === 'success' || body.status === 'queued';
        },
        'is success (no queue)': (r) => JSON.parse(r.body).status === 'success',
    });
}
