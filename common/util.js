export default {
	loadObj(obj, newObj){
		for(var p in newObj){
			if(newObj[p] && obj[p]!== undefined){
				obj[p] = newObj[p]
			}
		}
	}
}
