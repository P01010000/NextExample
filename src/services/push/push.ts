
import webpush from 'web-push';

const dummyDb: { subscription: webpush.PushSubscription | null } = {
    subscription: null,
};

const vapidKeys = {
    publicKey: process.env.PUSH_PUBLIC_KEY!,
    privateKey: process.env.PUSH_PRIVATE_KEY!,
}

webpush.setVapidDetails('http://localhost:3000', vapidKeys.publicKey, vapidKeys.privateKey)

export const saveToDatabase = async (subscription: webpush.PushSubscription) => {
    dummyDb.subscription = subscription;
}

export const sendNotification = async (msg: string) => {
    console.log('dummydb', dummyDb.subscription);
    if (dummyDb.subscription) {
        await webpush.sendNotification(dummyDb.subscription, msg);
    }
}
