import Storage from "../Storage";

export default class Transition{

    constructor({mode, accountId, title, description}){
        this.mode = mode;
        this.accountId = accountId;
        this.title = title;
        this.description = description;

        let date = new Date();
        this.time = {
            year: date.getFullYear(),
            mounth: date.getMonth(),
            date: date.getDate(),
            hour: date.getHours(),
            minute: date.getMinutes()
        }

        this.id = ''
        for(let i=0; i<24; i++){
            this.id += String.fromCharCode(Math.floor(Math.random() * 150) + 1);
        }
    }

    static create({type, mode, title, description}){
        let transition = new Transition({type, mode, title, description});
        return transition;
    }

    save(){        
        let transitionData = JSON.parse(Storage.getString('Transitions'));
        
        for(let i=0; i<transitionData.length; i++){
            if(transitionData[i].id == this.id) {
                transitionData[i] = this;
                Storage.set('Transitions', JSON.stringify(transitionData));
                return;
            }
        }

        transitionData.push(this);
        Storage.set('Transitions', JSON.stringify(transitionData));
    }

    static getAll(){
        if(Storage.contains('Transiton'))
            return JSON.parse(Storage.getString('Transitons'));
        return []
    }

    static getById(id){
        if(!Storage.contains('Transiton')) return {};

        let data = JSON.parse(Storage.getString('Transitons'));
       
        for(let transition of data){
            if(transition.id == id) return transition;
        }

        return {}
    }

    static getByMounth(mounth, year){
        if(!year) year = new Date().getFullYear();
        if(!mounth) return [];

        let transitionData = JSON.parse(Storage.getString('Transitions'));
        let thisMounthData = [];

        for(let i=0; i<transitionData.length; i++){
            let {mounth: m, year: y} = transitionData[i].time;
            if(mounth == m && year == y) thisMounthData.push(transitionData[i])
        }
        
        return thisMounthData;
    }
}