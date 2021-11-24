import English from './en/index';
import Hausa from './hausa/index';

export default (lan:string)=>{
    switch(lan){
        case "english":{
            return English;
            break;
        }

        case "hausa" : {
            return Hausa;
            break;
        }

        default : {
            return English;
            break;
        }
    }
}