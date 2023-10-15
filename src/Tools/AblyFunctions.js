class AblyFunctions {
    static async getAbly() {
        const Ably = require('ably');
        const ably = new Ably.Realtime.Promise('0sa0Qw.VDigAw:OeO1LYUxxUM7VIF4bSsqpHMSZlqMYBxN-cxS0fKeWDE');
        await ably.connection.once('connected');
        return ably;
    }

    static async getChannel(ably, channelId){
        const channel = ably.channels.get(channelId);
        return channel;
    }

    static async sendMessage(channelId, event, data){
        const ably = this.getAbly();
        const channel = this.getChannel(ably, channelId);
        await channel.publish(event, data);
        ably.close();
    }
}

export default AblyFunctions;