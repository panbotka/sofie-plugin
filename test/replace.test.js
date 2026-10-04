const test = require('node:test');
const assert = require('node:assert/strict');
const { replaceText } = require('../src/replace.js');

const cases = [
  // Nominative
  ['Sofie Elefteriadu zpívá.', 'Sofie Chodúrová zpívá.'],
  ['Zpěvačka Sofia Elefteriadou vystoupí.', 'Zpěvačka Sofia Chodúrová vystoupí.'],
  // Genitive
  ['Dopis od Sofie Elefteriadu.', 'Dopis od Sofie Chodúrové.'],
  ['Koncert bez Sofie Elefteriadu.', 'Koncert bez Sofie Chodúrové.'],
  // Dative
  ['Šli jsme k Sofii Elefteriadu.', 'Šli jsme k Sofii Chodúrové.'],
  ['Díky Sofii Elefteriadu.', 'Díky Sofii Chodúrové.'],
  // Accusative
  ['Mám dárek pro Sofii Elefteriadu.', 'Mám dárek pro Sofii Chodúrovou.'],
  ['Viděl jsem Sofii Elefteriadu.', 'Viděl jsem Sofii Chodúrovou.'],
  // Locative
  ['Článek o Sofii Elefteriadu.', 'Článek o Sofii Chodúrové.'],
  // Instrumental
  ['Rozhovor se Sofií Elefteriadu.', 'Rozhovor se Sofií Chodúrovou.'],
  ['Rozhovor se Sofii Elefteriadu.', 'Rozhovor se Sofii Chodúrovou.'],
  // Surname alone
  ['Paní Elefteriadu přišla.', 'Paní Chodúrová přišla.'],
  ['Mluvil jsem s paní Elefteriadu.', 'Mluvil jsem s paní Chodúrovou.'],
  ['Kytice od paní Elefteriadu.', 'Kytice od paní Chodúrové.'],
  // Spelling variants and letter case
  ['Sofie Eleftheriadou', 'Sofie Chodúrová'],
  ['SOFIE ELEFTERIADU', 'SOFIE CHODÚROVÁ'],
  ['sofie elefteriadu', 'sofie chodúrová'],
  ['Sofie Elefteriadu', 'Sofie Chodúrová'],
  // Multiple occurrences
  ['Sofie Elefteriadu a se Sofií Elefteriadu.', 'Sofie Chodúrová a se Sofií Chodúrovou.'],
];

for (const [input, expected] of cases) {
  test(input, () => assert.equal(replaceText(input), expected));
}

test('leaves unrelated text alone', () => {
  for (const text of ['Sofie Nováková', 'Elefteriaduovi', 'XElefteriadu', '', 'Nic tu není.']) {
    assert.equal(replaceText(text), text);
  }
});

test('ignores non-string input', () => {
  assert.equal(replaceText(null), null);
});
