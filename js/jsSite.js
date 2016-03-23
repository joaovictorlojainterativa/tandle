/**
 * Created by joao.victor on 16/03/2016.
 */
"use strict";
var tandleapp = angular.module("tandleapp", ["ngSanitize"]);

tandleapp.constant("ws_cep", "https://viacep.com.br/ws/");

tandleapp.directive("emailcadastro", ['$http', function ($http) {
    return {
        require: 'ngModel',
        priority: 2,
        link: function (scope, element, attrs, ctrl) {
            var lastemail = ctrl.$modelValue;

            ctrl.$setValidity('emailcadastro', false);

            angular.element(element).bind('blur', function () {

                if (lastemail == ctrl.$modelValue || ctrl.$modelValue == "" || ctrl.$error.email) {
                    if (ctrl.$modelValue == "") {
                        ctrl.$setValidity('emailcadastro', true);
                    }
                    return;
                }
                $http({
                    method: "POST",
                    url: "http://www.radiooncologia.com.br/admin/instituicao-beneficiaria/verificaemailaluno", /*
                     url: '',//*/
                    data: angular.element.param({"email": ctrl.$modelValue}),
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                }).then(function (response) {
                    if (response.data.sucesso)
                        ctrl.$setValidity('emailcadastro', true);
                    else {
                        ctrl.$setValidity('emailcadastro', false);
                    }
                    lastemail = ctrl.$modelValue;
                    scope.$applyAsync();

                }, function () {
                    ctrl.$setValidity('emailcadastro', false);
                });


            });

            ctrl.$validators.emailcadastro = function (model, view) {
                if (ctrl && ctrl.$validators.email(model, view)) {
                    if (model == "")
                        return false;
                    return true;
                }
            };
        }
    }
}]);

tandleapp.directive("notransfer", [function () {
    return {
        link: function (scope, element, attrs) {
            angular.element(element).bind("cut copy paste", function (e) {
                e.preventDefault();
            })
        }
    }
}]);

tandleapp.directive("mask", [function () {
    return {
        scope: {mask: "@"},
        link: function (scope, element, attrs) {
            angular.element(element).mask(scope.mask);
        }
    }
}]);

tandleapp.directive("masktel", [function () {
    return {
        link: function (scope, element, attrs) {
            var maskBehavior = function (val) {
                return val.replace(/\D/g, '').length === 11 ? '(00) 00000-0000' : '(00) 0000-00009';
            };
            var options = {
                onKeyPress: function (val, e, field, options) {
                    field.mask(maskBehavior.apply({}, arguments), options);
                }
            };
            angular.element(element).mask(maskBehavior, options);
        }
    }
}]);

tandleapp.directive("cnpj", [function () {
    return {
        require: 'ngModel',
        scope: {
            cnpj: "="
        },
        link: function (scope, element, attrs, ctrl) {

            ctrl.$validators.cnpj = function (model, view) {


                if (ctrl.$isEmpty(model) || model.replace(/[^\d]+/g, '').length < 14 || validarCNPJ(model)) {
                    //angular.element(element).tooltip('hide');
                    return true;

                } else {
                    //angular.element(element).tooltip('show');
                    return false;
                }

            };

            angular.element(element).mask("00.000.000/0000-00");
            angular.element(element).tooltip({
                trigger: "manual",
                title: "CNPJ inválido"
            });

            function validarCNPJ(cnpj) {
                var cnpj = cnpj.replace(/[^\d]+/g, '');


                if (cnpj == '') return false;

                if (cnpj.length != 14)
                    return false;

                // Elimina CNPJs invalidos conhecidos
                if (cnpj == "00000000000000" ||
                    cnpj == "11111111111111" ||
                    cnpj == "22222222222222" ||
                    cnpj == "33333333333333" ||
                    cnpj == "44444444444444" ||
                    cnpj == "55555555555555" ||
                    cnpj == "66666666666666" ||
                    cnpj == "77777777777777" ||
                    cnpj == "88888888888888" ||
                    cnpj == "99999999999999")
                    return false;

                // Valida DVs
                var tamanho = cnpj.length - 2;
                var numeros = cnpj.substring(0, tamanho);
                var digitos = cnpj.substring(tamanho);
                var soma = 0;
                var pos = tamanho - 7;
                for (var i = tamanho; i >= 1; i--) {
                    soma += numeros.charAt(tamanho - i) * pos--;
                    if (pos < 2)
                        pos = 9;
                }
                var resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
                if (resultado != digitos.charAt(0))
                    return false;

                tamanho = tamanho + 1;
                numeros = cnpj.substring(0, tamanho);
                soma = 0;
                pos = tamanho - 7;
                for (i = tamanho; i >= 1; i--) {
                    soma += numeros.charAt(tamanho - i) * pos--;
                    if (pos < 2)
                        pos = 9;
                }
                resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
                if (resultado != digitos.charAt(1))
                    return false;

                return true;

            }
        }
    }
}]);

tandleapp.directive("cpf", [function () {
    return {
        require: 'ngModel',
        scope: {
            cpf: "="
        },
        link: function (scope, element, attrs, ctrl) {
            ctrl.$validators.cpf = function (model, view) {


                if (ctrl.$isEmpty(model) || model.replace(/[^\d]+/g, '').length != 11 || validar(model)) {
                    //angular.element(element).tooltip('hide');
                    return true;

                } else {
                    //angular.element(element).tooltip('show');
                    return false;
                }

            };

            angular.element(element).mask("000.000.000-00");
            angular.element(element).tooltip({
                trigger: "manual",
                title: "CPF inválido"
            });

            function validar(strCPF) {
                var Soma;
                var Resto;
                var strCPF = strCPF.replace(/[^\d]+/g, '');
                Soma = 0;
                if (strCPF == "00000000000" || strCPF.length < 11)
                    return false;
                for (var i = 1; i <= 9; i++)
                    Soma = Soma + parseInt(strCPF.substring(i - 1, i)) * (11 - i);
                Resto = (Soma * 10) % 11;
                if ((Resto == 10) || (Resto == 11))
                    Resto = 0;
                if (Resto != parseInt(strCPF.substring(9, 10)))
                    return false;
                Soma = 0;
                for (i = 1; i <= 10; i++)
                    Soma = Soma + parseInt(strCPF.substring(i - 1, i)) * (12 - i);
                Resto = (Soma * 10) % 11;
                if ((Resto == 10) || (Resto == 11))
                    Resto = 0;
                if (Resto != parseInt(strCPF.substring(10, 11)))
                    return false;
                return true;
            }


        }
    }
}]);

tandleapp.controller("cadastroctrl", ["$scope", "$http", "ws_cep", '$timeout', function ($scope, $http, ws_cep, $timeout) {
    $scope.cursos = {
        cr: ''
    };

    $scope.exibirform = false;

    $scope.data = {
        nomeAluno: '',
        cpf: '',
        nomePai: '',
        nomeMae: '',
        dataNasc: '',
        genero: '',
        estadoCivil: '',
        rg: '',
        orgEmissor: '',
        dataExp: '',
        necessidadesespeciais: '',
        nacionalidade: '',
        endereco: '',
        complemento: '',
        bairro: '',
        cep: '',
        estado: '',
        municipio: '',
        email: '',
        emailconfirmacao: '',
        tel: '',
        cel: ''
    };
    $scope.cepvalido = false;
    $scope.estadosList = {
        1: "Acre",
        2: "Alagoas",
        3: "Amapá",
        4: "Amazonas",
        5: "Bahia",
        6: "Ceará",
        7: "Distrito Federal",
        8: "Espírito Santo",
        9: "Goiás",
        10: "Maranhão",
        11: "Mato Grosso",
        12: "Mato Grosso do Sul",
        13: "Minas Gerais",
        14: "Pará",
        15: "Paraíba",
        16: "Paraná",
        17: "Pernambuco",
        18: "Piauí",
        19: "Rio de Janeiro",
        21: "Rio Grande do Norte",
        22: "Rio Grande do Sul",
        23: "Rondônia",
        24: "Roraima",
        25: "Santa Catarina",
        26: "São Paulo",
        27: "Sergipe",
        28: "Tocantins"
    };
    $scope.estadosListID = {
        "AC": "1",
        "AL": "2",
        "AP": "3",
        "AM": "4",
        "BA": "5",
        "CE": "6",
        "DF": "7",
        "ES": "8",
        "GO": "9",
        "MA": "10",
        "MS": "11",
        "MT": "12",
        "MG": "13",
        "PA": "14",
        "PB": "15",
        "PR": "16",
        "PE": "17",
        "PI": "18",
        "RJ": "19",
        "RN": "21",
        "RS": "22",
        "RO": "23",
        "RR": "24",
        "SC": "25",
        "SP": "26",
        "SE": "27",
        "TO": "28",
    };
    $scope.listMunicipioStatus = "Selecione o município";
    $scope.municipioList = [];
    $scope.isLoadingCep = false;

    $scope.$watch("data.cep", function (newValue, oldValue, scope) {
        if (newValue == undefined)
            return;
        var cep = newValue.replace(/\D/g, '');
        if (cep.length === 8) {
            $scope.loadEnderecoByCep(cep);
        }
    }, true);
    $scope.$watch("data.estado", function (newValue, oldValue, scope) {
        $scope.loadMunicipiosByEstado(newValue);
    }, true);

    $scope.loadEnderecoByCep = function (cep) {
        if ($scope.isLoadingCep)
            return;
        $scope.isLoadingCep = true;
        var request = $http.get(ws_cep + cep + "/json/unicode/");
        console.log(request);
        request.success(function (response) {
            if (response.erro) {
                $scope.isLoadingCep = false;
                $scope.cepvalido = false;
                return;
            }

            try {
                console.log(response);
                $scope.data.bairro = response.bairro;
                $scope.data.endereco = response.logradouro;
                $scope.data.municipio = response.localidade;
                $scope.data.complemento = response.complemento != undefined ? response.complemento : "";
                //$scope.data.estado = response.uf.toUpperCase();
                $scope.data.estado = $scope.estadosListID[response.uf.toUpperCase()];
                $scope.loadMunicipiosByEstado($scope.data.estado);
                $scope.cepvalido = true;
            } catch (e) {
                console.log(e);
            }
            $scope.isLoadingCep = false;
        });
        request.error(function (response) {
            console.log(response);
        });
    };

    $scope.loadMunicipiosByEstado = function (estadoID) {
        if (estadoID.match(/\d+/g) == null)
            return;

        var estado_json = "http://www.radiooncologia.com.br/admin/municipios/#ID#/json".replace("#ID#", estadoID);
        /*
         var estado_json = "http://jsonplaceholder.typicode.com/posts/#ID#".replace("#ID#", estadoID);//*/


        $scope.listMunicipioStatus = "Carregando...";


        $http({
            method: "GET",
            url: estado_json,
        }).then(function (response) {
            $scope.listMunicipioStatus = "Selecione o município";
            $scope.municipioList = response.data;
            for (var i in $scope.municipioList) {
                if ($scope.municipioList[i].nome == $scope.data.municipio) {
                    $scope.data.municipio = $scope.municipioList[i].id;
                    break;
                }
            }
            $scope.$applyAsync();
        }, function () {
            console.warn(arguments);
        });


    };

    $scope.submit = function (form) {
        if (typeof form == "undefined")
            return;
        console.log(form.$valid, $scope.data);
        if (form.$valid && $scope.data.email == $scope.data.emailconfirmacao && $scope.cepvalido) {
            console.log("valido");
            $scope.$applyAsync();
        }
    };
}]);

tandleapp.controller("contatoaddctrl", ["$scope", "$http", function ($scope, $http) {
    $scope.data = {
        nome: '',
        email: '',
        setor: '',
        celular: '',
        telefone: '',
        ramal: ''
    }

    $scope.submit = function (form) {
        if (typeof form == "undefined")
            return;
        console.log(form.$valid, $scope.data);

        if (form.$valid) {
            console.log("valido");
            $scope.$applyAsync();
        }
    };

}]);

tandleapp.controller("insituicaoCtrl", ['$scope', '$http', 'ws_cep', function ($scope, $http, ws_cep) {
    $scope.data = {
        nome: '',
        cnpj: '',
        endereco: '',
        complemento: '',
        bairro: '',
        cep: '',
        estado: '',
        municipio: '',
        instituicao: '',
        unidade: ''
    };

    $scope.estadosList = {
        1: "Acre",
        2: "Alagoas",
        3: "Amapá",
        4: "Amazonas",
        5: "Bahia",
        6: "Ceará",
        7: "Distrito Federal",
        8: "Espírito Santo",
        9: "Goiás",
        10: "Maranhão",
        11: "Mato Grosso",
        12: "Mato Grosso do Sul",
        13: "Minas Gerais",
        14: "Pará",
        15: "Paraíba",
        16: "Paraná",
        17: "Pernambuco",
        18: "Piauí",
        19: "Rio de Janeiro",
        21: "Rio Grande do Norte",
        22: "Rio Grande do Sul",
        23: "Rondônia",
        24: "Roraima",
        25: "Santa Catarina",
        26: "São Paulo",
        27: "Sergipe",
        28: "Tocantins"
    };
    $scope.estadosListID = {
        "AC": "1",
        "AL": "2",
        "AP": "3",
        "AM": "4",
        "BA": "5",
        "CE": "6",
        "DF": "7",
        "ES": "8",
        "GO": "9",
        "MA": "10",
        "MS": "11",
        "MT": "12",
        "MG": "13",
        "PA": "14",
        "PB": "15",
        "PR": "16",
        "PE": "17",
        "PI": "18",
        "RJ": "19",
        "RN": "21",
        "RS": "22",
        "RO": "23",
        "RR": "24",
        "SC": "25",
        "SP": "26",
        "SE": "27",
        "TO": "28",
    };
    $scope.listMunicipioStatus = "Selecione o município";
    $scope.municipioList = [];
    $scope.isLoadingCep = false;

    $scope.$watch("data.cep", function (newValue, oldValue, scope) {
        if (newValue == undefined)
            return;
        var cep = newValue.replace(/\D/g, '');
        if (cep.length === 8) {
            $scope.loadEnderecoByCep(cep);
        }
    }, true);
    $scope.$watch("data.estado", function (newValue, oldValue, scope) {
        $scope.loadMunicipiosByEstado(newValue);
    }, true);

    $scope.loadEnderecoByCep = function (cep) {
        if ($scope.isLoadingCep)
            return;
        $scope.isLoadingCep = true;
        var request = $http.get(ws_cep + cep + "/json/unicode/");

        request.success(function (response) {
            if (response.erro) {
                $scope.isLoadingCep = false;
                return;
            }

            try {
                console.log(response);
                $scope.data.bairro = response.bairro;
                $scope.data.endereco = response.logradouro;
                $scope.data.municipio = response.localidade;
                $scope.data.complemento = response.complemento != undefined ? response.complemento : "";
                //$scope.data.estado = response.uf.toUpperCase();
                $scope.data.estado = $scope.estadosListID[response.uf.toUpperCase()];
                $scope.loadMunicipiosByEstado($scope.data.estado);
            } catch (e) {
                console.log(e);
            }
            $scope.isLoadingCep = false;
        });
    };

    $scope.loadMunicipiosByEstado = function (estadoID) {
        if (estadoID.match(/\d+/g) == null)
            return;

        var estado_json = "http://www.radiooncologia.com.br/admin/municipios/#ID#/json".replace("#ID#", estadoID);
        /*
         var estado_json = "http://jsonplaceholder.typicode.com/posts/#ID#".replace("#ID#", estadoID);//*/


        $scope.listMunicipioStatus = "Carregando...";


        $http({
            method: "GET",
            url: estado_json,
        }).then(function (response) {
            $scope.listMunicipioStatus = "Selecione o município";
            $scope.municipioList = response.data;
            for (var i in $scope.municipioList) {
                if ($scope.municipioList[i].nome == $scope.data.municipio) {
                    $scope.data.municipio = $scope.municipioList[i].id;
                    break;
                }
            }
            $scope.$applyAsync();
        }, function () {
            console.warn(arguments);
        });


    };

    $scope.submit = function (form) {
        if (typeof form == "undefined")
            return;
        console.log(form.$valid, $scope.data);

        if (form.$valid) {
            console.log("valido");
            $scope.$applyAsync();
        }
    };
}]);