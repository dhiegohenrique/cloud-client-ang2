[![Build Status](https://travis-ci.org/dhiegohenrique/cloud-client-ang2.svg?branch=master)](https://travis-ci.org/dhiegohenrique/cloud-client-ang2)

Requisitos:
1) NPM 4.0.5 ou superior (https://www.npmjs.com/get-npm);
2) angular-cli (https://github.com/angular/angular-cli);
3) O backend deve estar rodando (https://github.com/dhiegohenrique/cloud-api);

Para rodar, na pasta raíz, executar:
1) npm install;
2) ng serve;
3) a aplicação estará rodando em: http://localhost:4200

Para rodar os testes via [Karma](https://karma-runner.github.io):
1) npm test;

Para rodar os testes end-to-end via [Protractor](http://www.protractortest.org/):
1) O backend deve estar rodando (https://github.com/dhiegohenrique/cloud-api);
2) npm run e2e;

Para gerar a versão de distribuição:
1) npm run build;

A cada commit, serão realizados testes unitários no Travis. Se passarem, o deploy será realizado em https://cloud-client-ang2.herokuapp.com/