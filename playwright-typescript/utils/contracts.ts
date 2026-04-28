import Ajv from 'ajv';
import fs from 'node:fs';
import path from 'node:path';

const ajv = new Ajv({ allErrors: true, strict: true });

export function expectSchemaMatch(fileName: string, payload: unknown): void {
  const schemaPath = path.resolve(__dirname, '../../demo-services/test-api/contracts', fileName);
  const schema = JSON.parse(fs.readFileSync(schemaPath, 'utf8')) as object;
  const validate = ajv.compile(schema);

  if (validate(payload)) {
    return;
  }

  const details = ajv.errorsText(validate.errors, { separator: '\n' });
  throw new Error(`Schema validation failed for ${fileName}:\n${details}`);
}
