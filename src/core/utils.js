import MirrorError from '../model/error.model';

export default class Utils {

    error(err) {
        return new MirrorError({error: true, message: err.error, err: err.err});
    }
}