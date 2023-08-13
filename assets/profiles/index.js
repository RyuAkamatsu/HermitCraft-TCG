const FLO = require('./florence.png');
const HAROLD = require('./harold.png');
const LUKE = require('./luke.png');
const MARY = require('./mary.png');
const SARAH = require('./sarah.png');

export default function getProfilePic(pic) {
    switch (pic) {
        case 'florence.png':
            return FLO;
        case 'harold.png':
            return HAROLD;
        case 'luke.png':
            return LUKE;
        case 'mary.png':
            return MARY;
        case 'sarah.png':
            return SARAH;
        default:
            return null;
    }
}
