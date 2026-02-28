import path from 'path';

const mainFilename = require.main?.filename ?? __filename;
export default path.dirname(mainFilename);
