const noteColors = ['#009CCC', '#CC293D', '#FFD700'];

const noteColor = {};

noteColor.getNoteColor = (num) => {
    return noteColors[Math.min(num, noteColors.length - 1)];
}
noteColor.getNoteColorSize = (num) => {
    return noteColors.length;
}


export default noteColor;


