const test = require('node:test');
const assert = require('node:assert/strict');
const { replaceText } = require('../src/replace.js');

const cases = [
  // Nominative
  ['Sofie Elefteriadu zpívá.', 'Sofie Chodurová zpívá.'],
  ['Zpěvačka Sofia Elefteriadou vystoupí.', 'Zpěvačka Sofia Chodurová vystoupí.'],
  // Genitive
  ['Dopis od Sofie Elefteriadu.', 'Dopis od Sofie Chodurové.'],
  ['Koncert bez Sofie Elefteriadu.', 'Koncert bez Sofie Chodurové.'],
  // Dative
  ['Šli jsme k Sofii Elefteriadu.', 'Šli jsme k Sofii Chodurové.'],
  ['Díky Sofii Elefteriadu.', 'Díky Sofii Chodurové.'],
  // Accusative
  ['Mám dárek pro Sofii Elefteriadu.', 'Mám dárek pro Sofii Chodurovou.'],
  ['Viděl jsem Sofii Elefteriadu.', 'Viděl jsem Sofii Chodurovou.'],
  // Locative
  ['Článek o Sofii Elefteriadu.', 'Článek o Sofii Chodurové.'],
  // Instrumental
  ['Rozhovor se Sofií Elefteriadu.', 'Rozhovor se Sofií Chodurovou.'],
  ['Rozhovor se Sofii Elefteriadu.', 'Rozhovor se Sofii Chodurovou.'],
  // Surname alone
  ['Paní Elefteriadu přišla.', 'Paní Chodurová přišla.'],
  ['Mluvil jsem s paní Elefteriadu.', 'Mluvil jsem s paní Chodurovou.'],
  ['Kytice od paní Elefteriadu.', 'Kytice od paní Chodurové.'],
  // Spelling variants and letter case
  ['Sofie Eleftheriadou', 'Sofie Chodurová'],
  ['SOFIE ELEFTERIADU', 'SOFIE CHODUROVÁ'],
  ['sofie elefteriadu', 'sofie chodurová'],
  ['Sofie Elefteriadu', 'Sofie Chodurová'],
  // Multiple occurrences
  ['Sofie Elefteriadu a se Sofií Elefteriadu.', 'Sofie Chodurová a se Sofií Chodurovou.'],
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
