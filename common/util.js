export default {
	loadObj(obj, newObj) {
		for (var p in newObj) {
			if (newObj[p] && obj[p] !== undefined) {
				obj[p] = newObj[p]
			}
		}
	},
	dateFormat(timestamp) {
		let date = new Date(timestamp);
		let year = date.getFullYear();
		let month = date.getMonth() + 1;
		let day = date.getDate();
		month = month > 9 ? month : '0' + month;;
		day = day > 9 ? day : '0' + day;
		return `${year}-${month}-${day}`;
	}

}
