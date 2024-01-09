import mongoose from "mongoose";
const ConversationShema=new mongoose.Schema({
    
    member: {
        type:Array
    }
},
{timestamps:true}
);

 export default mongoose.model("Conversation",ConversationShema);