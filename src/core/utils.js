import MirrorError from '../model/error.model';

export default class Utils {

    error(err) {
        return new MirrorError({error: true, message: err.message, err: err.err});
    }

    safeParse(data) {
        let d = '';
        try {
            d = JSON.parse(data);
            return d;
        } catch (err) {
            return undefined;
        }
    }
}