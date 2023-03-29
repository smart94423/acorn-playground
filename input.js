import { someImport as someImportRenamed, someOtherImport } from "./some-file";
import someDefaultImport from './some-file-2';

const someVar = someImportRenamed;

export default {
  Page: someVar,
  onBeforeRender: someDefaultImport,
  onHtmlRender: someOtherImport,
};
