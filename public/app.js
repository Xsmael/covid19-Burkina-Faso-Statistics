(function () {
angular.module('app', ['ui.router', "firebase", "uiCropper", "chart.js", "yaru22.angular-timeago", "angular-flipclock", "ui-leaflet"])
.directive('limitMax', function() {
	return {
  	restrict: 'AE', //attribute or element,
    require: 'ngModel',
    link:function(s,e,a,ngModel){
    	e.bind('keyup',function(event){
        console.log(ngModel.$modelValue);
        if(ngModel.$modelValue>10){
          event.preventDefault();
          ngModel.$setViewValue(10);
          ngModel.$render();
        }
      });
    }
  };
})

.config( function($stateProvider, $urlRouterProvider) {

  $stateProvider
      .state('home', {
          url: '/',
          controller: 'HomeController',
          templateUrl: 'tmpl/home.html'
      })
      .state('main', {
          url: '/main',
          controller: 'MainController',
          templateUrl: 'tmpl/main.html'
      })
      .state('stat', {
          url: '/stat',
          controller: 'StatController',
          templateUrl: 'tmpl/stat.html'
      })
      $urlRouterProvider.otherwise('/main');

})

.controller('LeafController', function($scope, $rootScope, $FirebaseArray, $firebaseStorage) {
    var local_icons = {
        default_icon: {},
       
        viral1: {
            iconUrl: 'img/marker1.png',
             iconSize:     [10, 10], // size of the icon
            iconAnchor:   [5, 5], // point of the icon which will correspond to marker's location
            popupAnchor:  [0, 0] // point from which the popup should open relative to the iconAnchor
        },
        viral2: {
            iconUrl: 'img/marker1.png',
             iconSize:     [20, 20], // size of the icon
            iconAnchor:   [10, 10], // point of the icon which will correspond to marker's location
            popupAnchor:  [0,0] // point from which the popup should open relative to the iconAnchor
        },
        viral3: {
            iconUrl: 'img/marker1.png',
             iconSize:     [50, 50], // size of the icon
            iconAnchor:   [25, 25], // point of the icon which will correspond to marker's location
            popupAnchor:  [0, 0] // point from which the popup should open relative to the iconAnchor
        },
        viral4: {
            iconUrl: 'img/marker1.png',
             iconSize:     [100, 100], // size of the icon
            iconAnchor:   [50, 50], // point of the icon which will correspond to marker's location
            popupAnchor:  [0, 0] // point from which the popup should open relative to the iconAnchor
        },
        viral5: {
            iconUrl: 'img/marker1.png',
             iconSize:     [200, 200], // size of the icon
            iconAnchor:   [100, 100], // point of the icon which will correspond to marker's location
            popupAnchor:  [0, 0] // point from which the popup should open relative to the iconAnchor
        }
    };
    $scope.center= {
        lat: 12.3714277,
        lng: -1.5210346000000072,
        zoom: 7
    };

    $scope.markers= {};

    $scope.villes.forEach( (ville,idx) => {
        console.info(ville);
        
        $scope.markers["m"+idx]= {
            lat: ville.lat,
            lng: ville.lng,
            message: ville.cases+ " cas",
            draggable: false,
            icon: local_icons['viral'+getDegree(ville.cases)]
        };
    });
    console.log($scope.markers);
    

    function getDegree(n) {
        if(n >=200) return 5;
        if(n >=100) return 4;
        if(n >=50) return 3;
        if(n >=5) return 2;
        if(n >=1) return 1;
    }

    $scope.controls= {
        fullscreen: {
            position: 'topleft'
        }
    };
    
   
})

.controller('MainController', function($http, $scope, $rootScope, $state, $firebaseObject, $FirebaseArray) {

    /**NEWS */
    let keys=[
        
        '20698516c289c02c7d9bdf017b50b4ba'
    ];
    // let rand= Math.round(Math.random() * 10);
    let rand= 0;

    var thumbnailAPI= "http://api.linkpreview.net/?key="+keys[rand]+"&q=";
    // $scope.news_links=[
    //     "https://www.burkina24.com/2020/03/26/covid-19-au-burkina-8-villes-mises-en-quarantaine-pour-deux-semaines/",
    //     "https://www.burkina24.com/2020/03/27/covid-19-emmanuel-nakoulma-appelle-les-taximen-de-ouaga-et-bobo-a-couper-le-moteur/",
    //     "https://www.burkina24.com/2020/03/27/covid-19-la-declaration-de-lassociation-des-etudiants-burkinabe-en-france/",
    //     "https://www.burkina24.com/2020/03/27/covid-19-180-personnes-testees-positives-au-burkina/",
    //     "http://omegabf.info/societe/burkina-coronavirus-transport-de-passagers-par-velomoteurs-motocyclettes-tricycles-et-quadricycle-desormais-interdit-ministere-des-transports/",
    //     "https://www.burkina24.com/2020/03/27/fermeture-des-36-marches-a-ouagadougou-les-acteurs-du-secteur-informel-sengagent-pour-le-respect-des-textes/",
    //     "https://www.burkina24.com/2020/03/27/premier-jour-de-quarantaine-a-ouaga-que-de-galere-au-poste-de-controle-de-gonse/"
    // ];

    $scope.news_links=[];
    $scope.newsThumbs=[{"title":"Fermeture des 36 marchés à Ouagadougou : Les acteurs du secteur informel s’engagent pour le respect des textes - L'Actualité du Burkina Faso 24h/24","description":"ECOUTER Du 26 mars au 20 avril 2020, 36 sur 80 marchés et yaars de Ouagadougou sont fermés à cause du Covid-19. Le Conseil national de l’économie informelle du Burkina Faso (CNEI-BF) a demandé à ses membres de respecter la décision gouvernementale. C’était ce vendredi 27 mars 2020 à Ouagadougou A la suite de la","image":"https://www.burkina24.com/wp-content/uploads/2020/03/IMG_20200327_121042_631-scaled.jpg","url":"https://www.burkina24.com/2020/03/27/fermeture-des-36-marches-a-ouagadougou-les-acteurs-du-secteur-informel-sengagent-pour-le-respect-des-textes/"},
    {"title":"Covid-19 au Burkina : 8 villes mises en quarantaine pour deux semaines - L'Actualité du Burkina Faso 24h/24","description":"ECOUTER A la date du 25 mars 2020 le Burkina compte 152 cas confirmés de covid-19. L’information a été donnée ce jeudi 26 mars 2020 par le coordonnateur national de la réponse de la pandémie du coronavirus au cours du point de presse du gouvernement. Le porte-parole du gouvernement a annoncé les nouvelles mesures prises","image":"https://www.burkina24.com/wp-content/uploads/2020/03/1-9-scaled.jpg","url":"https://www.burkina24.com/2020/03/26/covid-19-au-burkina-8-villes-mises-en-quarantaine-pour-deux-semaines/"},
    {"title":"COVID-19 : Emmanuel Nakoulma appelle les taximen de Ouaga et Bobo à couper le moteur - L'Actualité du Burkina Faso 24h/24","description":"ECOUTER Emmanuel Nakoulma est le Président de la Fédération nationale des syndicats des taximen et des acteurs du transport urbain du Burkina. Aux micros de Burkina24, ce vendredi 27 mars 2020, il a lancé un appel à tous les taximen du pays, plus particulièrement des deux grandes villes Ouagadougou et Bobo-Dioulasso de respecter les décisions","image":"https://www.burkina24.com/wp-content/uploads/2020/03/IMG_20200327_122749_159-scaled.jpg","url":"https://www.burkina24.com/2020/03/27/covid-19-emmanuel-nakoulma-appelle-les-taximen-de-ouaga-et-bobo-a-couper-le-moteur/"},
    {"title":"COVID-19 : La déclaration de l'Association des Etudiants Burkinabè en France - L'Actualité du Burkina Faso 24h/24","description":"ECOUTER  Ceci est une déclaration de l’Association des Etudiants Burkinabè en France (AEBF) sur la pandémie de COVID-19. Camarades étudiant.e.s, L’actualité nationale et internationale est marquée par la crise sanitaire due à la pandémie du COVID-19. Cette maladie apparue en Chine en décembre 2019 a fait, à ce jour, plus de 22 000 morts et","image":"https://www.burkina24.com/wp-content/uploads/2020/03/Pharmacie-au-Burkina-Covid-19.jpg","url":"https://www.burkina24.com/2020/03/27/covid-19-la-declaration-de-lassociation-des-etudiants-burkinabe-en-france/"},
    {"title":"COVID-19 : 180 personnes testées positives au Burkina - L'Actualité du Burkina Faso 24h/24","description":"ECOUTER Le ministre de la communication et le coordonnateur du plan de riposte ont animé le dernier point de presse journalier sur l’état du COVID-19 au Burkina. A la date du 27 mars 2020, le Burkina compte désormais 180 cas confirmés de COVID-19. Deux nouveaux cas de décès ont été enregistrés ainsi que deux guérisons.","image":"https://www.burkina24.com/wp-content/uploads/2020/03/IMG-20200327-WA0030-scaled.jpg","url":"https://www.burkina24.com/2020/03/27/covid-19-180-personnes-testees-positives-au-burkina/"},
    {"title":"Burkina: Coronavirus : \"transport de passagers par vélomoteurs, motocyclettes, tricycles et quadricycle désormais interdit\" (ministère des transports)","description":"Le ministère des transports interdit le transport urbain et interurbain à titre onéreux ou pour compte propre, de passagers ou de voyageurs par tricycle et quadricycle à moteur sur toute l'étendue du territoire. L'annonce a été faite à travers un arrêté ministériel et cette interdiction prend effet","image":"https://secureservercdn.net/198.71.233.135/5gd.013.myftpupload.com/wp-content/uploads/2020/03/received_832618033879795.jpeg?time=1585346783","url":"http://omegabf.info/societe/burkina-coronavirus-transport-de-passagers-par-velomoteurs-motocyclettes-tricycles-et-quadricycle-desormais-interdit-ministere-des-transports/"},
    {"title":"Premier jour de quarantaine à Ouaga : Que de galère au poste de contrôle de Gonsé ! - L'Actualité du Burkina Faso 24h/24","description":"ECOUTER Depuis 5h ce vendredi 27 mars 2020, personne ne rentre et ne sort de Ouagadougou ainsi que les autres localités touchées par le COVID-19. Exception faite aux transports de marchandises. Cette mise en quarantaine décidée seulement la veille, 26 mars 2020, ne fait pas que des heureux. Constat au poste de contrôle de gendarmerie","image":"https://www.burkina24.com/wp-content/uploads/2020/03/Poste-de-Gendarmerie-scaled.jpg","url":"https://www.burkina24.com/2020/03/27/premier-jour-de-quarantaine-a-ouaga-que-de-galere-au-poste-de-controle-de-gonse/"}
];
    
    $scope.news_links.forEach(url => {
       $http.get(thumbnailAPI+url,{})
        .then(function success(res) {
            $scope.newsThumbs.push(res.data);  
            
        },
        function error(e) {
            console.error(e);        
        });
        
    });
   
    $scope.counts= [
        { name: "Ouagadougou", n: 127 },
        { name: "Bobo Dioulasso", n: 10 },
        { name: "Banfora", n: 1 },
        { name: "Arbinda", n: 0 },
        { name: "Bagré", n: 0 },
        { name: "Batié", n: 0 },
        { name: "Bogandé", n: 0 },
        { name: "Boulsa", n: 0 },
        { name: "Boromo", n: 6 },
        { name: "Boussé", n: 0 },
        { name: "Dano", n: 0 },
        { name: "Dédougou", n: 2 },
        { name: "Diapaga", n: 0 },
        { name: "Diébougou", n: 0 },
        { name: "Djibo", n: 0 },
        { name: "Dori", n: 0 },
        { name: "Fada N'gourma", n: 0 },
        { name: "Gaoua", n: 0 },
        { name: "Garango", n: 0 },
        { name: "Gayéri", n: 0 },
        { name: "Gorom-Gorom", n: 0 },
        { name: "Gourcy", n: 0 },
        { name: "Houndé", n: 3 },
        { name: "Kantchari", n: 0 },
        { name: "Kaya", n: 0 },
        { name: "Kindi", n: 0 },
        { name: "Kokologo", n: 0 },
        { name: "Kombissiri", n: 0 },
        { name: "Kcountgoussi", n: 0 },
        { name: "Kordié", n: 0 },
        { name: "Koudougou", n: 0 },
        { name: "Kouka, Bam", n: 0 },
        { name: "Kouka, Banwa", n: 0 },
        { name: "Koupéla", n: 0 },
        { name: "Léo", n: 0 },
        { name: "Loropeni", n: 0 },
        { name: "Manga", n: 1 },
        { name: "Méguet", n: 0 },
        { name: "Mogtedo", n: 0 },
        { name: "Niangoloko", n: 0 },
        { name: "Nouna", n: 0 },
        { name: "Orodara", n: 0 },
        { name: "Ouahigouya", n: 0 },
        { name: "Ouargaye", n: 0 },
        { name: "Pama", n: 0 },
        { name: "Pissila", n: 0 },
        { name: "Pô", n: 0 },
        { name: "Pouytenga", n: 0 },
        { name: "Réo", n: 0 },
        { name: "Sapcounté", n: 0 },
        { name: "Sapouy", n: 0 },
        { name: "Sebba", n: 0 },
        { name: "Séguénéga", n: 0 },
        { name: "Sindou", n: 0 },
        { name: "Solenzo", n: 0 },
        { name: "Tangin Dassouri", n: 0 },
        { name: "Tenkodogo", n: 0 },
        { name: "Tikaré", n: 0 },
        { name: "Titao", n: 0 },
        { name: "Toma", n: 0 },
        { name: "Tougan", n: 0 },
        { name: "Villy", n: 0 },
        { name: "Yako", n: 0 },
        { name: "Ziniaré", n: 0 },
        { name: "Zorgo", n: 0 }
    ];
 
    $http.get("https://pomber.github.io/covid19/timeseries.json",{})
    .then(function success(res) {
        console.log(res.data['Burkina Faso']); 
        /**Charts */
        var cases= res.data['Burkina Faso'].splice(47, res.data['Burkina Faso'].length -47 ); 
              
        var totalCases= cases.pop();
        $rootScope.totalCases= totalCases;
        let active= totalCases.confirmed -totalCases.deaths -totalCases.recovered;
        $rootScope.totalCases.active= active;
        
    },
    function error(e) {
        console.error(e);        
    })

  
    
})
.controller('StatController', function($http, $scope, $rootScope, $state, $firebaseObject, $FirebaseArray) {

    $http.get("https://pomber.github.io/covid19/timeseries.json",{})
    .then(function success(res) {
        console.log(res.data['Burkina Faso']); 
        /**Charts */
        var cases= res.data['Burkina Faso'].splice(47, res.data['Burkina Faso'].length -47 ); 
        let stats = {};
            stats.labels = [];
            stats.series = ['Cas Confirmé','Rétablissements','Déces'];
            stats.data = [
                [],[],[]
            ];

            stats.options = {
                scales: {
                    xAxes: [{
                        type: 'time',
                        offset: true,
                        barPercentage: 0.5
                    }]
                },
                legend: {
                    display: true
                }
            };
            cases.forEach(row => {
                stats.labels.push(row.date);
                stats.data[0].push(row.confirmed);
                stats.data[1].push(row.recovered);
                stats.data[2].push(row.deaths);
            });
            $scope.casesChart = stats;

            
        var totalCases= cases.pop();
        $rootScope.totalCases= totalCases;
        let active= totalCases.confirmed -totalCases.deaths -totalCases.recovered;
        $rootScope.totalCases.active= active;
        $scope.OperatorSent = {};
        $scope.OperatorSent.labels = ["Cas Actifs", "Rétablis", "Déces"];
        $scope.OperatorSent.data = [active, totalCases.recovered, totalCases.deaths];
        $scope.OperatorSent.colors = ["#dc3545", "#28a745", "#000000"];
        $scope.OperatorSent.options = {
            legend: {display: true},
        }; 
        
    },
    function error(e) {
        console.error(e);        
    })


    $rootScope.villes= [
        {
            name:"Ouagadougou",
            cases: 127,
            healed:10,
            dead:7, 
            lat: 12.3714,
            lng: -1.5210
        },
        {
            name:"Bobo-Dioulasso",
            cases: 10,
            healed:0,
            dead:0,
            lat:11.167413,
            lng:-4.299802
        },
        {
            name:"Houndé",
            cases: 3,
            healed:0,
            dead:0,
            lat:11.490034,
            lng:-3.522406
        },
        {
            name:"Boromo",
            cases: 6,
            healed:0,
            dead:0,
            lat:11.746979, 
            lng:-2.929616
        },
        {
            name:"Dédougou",
            cases: 2,
            healed:0,
            dead:0,
            lat:12.455623, 
            lng:-3.468755
        },
        {
            name:"Banfora",
            cases: 1,
            healed:0,
            dead:0,
            lat:10.642469, 
            lng:-4.757145
        },
        {
            name:"Manga",
            cases: 6,
            healed:0,
            dead:0,
            lat:11.662828, 
            lng:-1.067734
        }
    ];
    // Province (Chef-lieu)	Cas confirmés	Guéris	Morts	Date du 1er cas
    // Kadiogo (Ouagadougou)	127	7	7	9 mars 2020
    // Tuy (Houndé)	3	0	0	14 mars 2020
    // Houet (Bobo-Dioulasso)	6	0	0	17 mars 2020
    // Balés (Boromo)	6	0	0	20 mars 2020
    // Mouhoun (Dédougou)	2	0	0	20 mars 2020
    // Comoé (Banfora)	1	0	0	22 mars 2020
    // Zoundwéogo (Manga)	1	0	0	

    $scope.counts= [
        { name: "Ouagadougou", n: 127 },
        { name: "Bobo Dioulasso", n: 10 },
        { name: "Banfora", n: 1 },
        { name: "Arbinda", n: 0 },
        { name: "Bagré", n: 0 },
        { name: "Batié", n: 0 },
        { name: "Bogandé", n: 0 },
        { name: "Boulsa", n: 0 },
        { name: "Boromo", n: 6 },
        { name: "Boussé", n: 0 },
        { name: "Dano", n: 0 },
        { name: "Dédougou", n: 2 },
        { name: "Diapaga", n: 0 },
        { name: "Diébougou", n: 0 },
        { name: "Djibo", n: 0 },
        { name: "Dori", n: 0 },
        { name: "Fada N'gourma", n: 0 },
        { name: "Gaoua", n: 0 },
        { name: "Garango", n: 0 },
        { name: "Gayéri", n: 0 },
        { name: "Gorom-Gorom", n: 0 },
        { name: "Gourcy", n: 0 },
        { name: "Houndé", n: 3 },
        { name: "Kantchari", n: 0 },
        { name: "Kaya", n: 0 },
        { name: "Kindi", n: 0 },
        { name: "Kokologo", n: 0 },
        { name: "Kombissiri", n: 0 },
        { name: "Kcountgoussi", n: 0 },
        { name: "Kordié", n: 0 },
        { name: "Koudougou", n: 0 },
        { name: "Kouka, Bam", n: 0 },
        { name: "Kouka, Banwa", n: 0 },
        { name: "Koupéla", n: 0 },
        { name: "Léo", n: 0 },
        { name: "Loropeni", n: 0 },
        { name: "Manga", n: 1 },
        { name: "Méguet", n: 0 },
        { name: "Mogtedo", n: 0 },
        { name: "Niangoloko", n: 0 },
        { name: "Nouna", n: 0 },
        { name: "Orodara", n: 0 },
        { name: "Ouahigouya", n: 0 },
        { name: "Ouargaye", n: 0 },
        { name: "Pama", n: 0 },
        { name: "Pissila", n: 0 },
        { name: "Pô", n: 0 },
        { name: "Pouytenga", n: 0 },
        { name: "Réo", n: 0 },
        { name: "Sapcounté", n: 0 },
        { name: "Sapouy", n: 0 },
        { name: "Sebba", n: 0 },
        { name: "Séguénéga", n: 0 },
        { name: "Sindou", n: 0 },
        { name: "Solenzo", n: 0 },
        { name: "Tangin Dassouri", n: 0 },
        { name: "Tenkodogo", n: 0 },
        { name: "Tikaré", n: 0 },
        { name: "Titao", n: 0 },
        { name: "Toma", n: 0 },
        { name: "Tougan", n: 0 },
        { name: "Villy", n: 0 },
        { name: "Yako", n: 0 },
        { name: "Ziniaré", n: 0 },
        { name: "Zorgo", n: 0 }
    ];

})

.controller('CartController', function($scope, $rootScope, $timeout, $state, $FirebaseArray) {
    $rootScope.displaySearchBar=false;    
    $rootScope.webIface.emit('state','cart');
    $rootScope.cartTotal= $rootScope.cartTotal? $rootScope.cartTotal : 0;

    
    var ref = firebase.database().ref();
    var orders = $FirebaseArray(ref.child("orders") );
    
    $scope.enqueueOrder= function(order) {     
    }

    $scope.removeOrder= function(order) {
        orders.$remove(order).then(function(ref) {            
            console.log(ref.key);
            console.log(item.$id);
          });
    }

    $scope.placeOrder= function () {
        $scope.waintingForOrderAccepted= true;
        console.log($rootScope.cart);

        $rootScope.cart.forEach(cartItem => {
            cartItem.status= 'placed';
            cartItem.timePlaced= Date.now();
            cartItem.tableId= Date.now();
            cartItem.takeAway= false;
            cartItem.source= {
                role:'customer',
                name:'John Boe',
                phone:'54535423'
            }
            orders.$add(cartItem).then(function(ref){});
           
        });
        
        $timeout(function () {
            $scope.waintingForOrderAccepted= false;
            $rootScope.order=  $rootScope.cart;
            $rootScope.cart= [];
            $state.go('order');
        },2000);
    }

    $scope.parseOrder= function () {
        console.log($rootScope.items);
        if($rootScope.items) {
            $rootScope.items.forEach(item => {
                if(item.qty>0) {
                    $rootScope.cart.push(item);
                    $rootScope.cartTotal+= (item.price*item.qty);
                }
            });
            $rootScope.cartEmpty= ($rootScope.cart.length > 0)? false : true;

        }
        else
            $scope.cartEmpty= true;
    }
    $scope.parseOrder();
})

.controller('OrderController', function($scope, $rootScope) {
    $rootScope.webIface.emit('state','order');
    $rootScope.displaySearchBar=false;    

})

.controller('Controller', function($scope, $rootScope) {

})
.controller('LoginController', function($scope, $rootScope, $state, $FirebaseArray) {
    
    var ref = firebase.database().ref();
    var users = $FirebaseArray(ref.child("user") );
    $scope.users= users;  // scope binding
    
    $scope.roles= ["Admin", "Manager", "Cook", "Waiter", "Delivery", "Cashier"];
    $scope.showLoginForm= false;
    
    $scope.setAccount= function (userData) {
        $scope.user= userData;   
        $scope.showLoginForm= true;
    }
    $scope.login= function () {
        $state.go("menu");
    }
})

.controller('UserController', function($scope, $rootScope, $FirebaseArray, $firebaseStorage) {
    $scope.image = '';
    $scope.croppedImage = '';

    var ref = firebase.database().ref();
    var users = $FirebaseArray(ref.child("user") );
    $scope.users= users;  // scope binding

    $scope.roles= ["Admin", "Manager", "Cook", "Waiter", "Delivery", "Cashier"];
    
    // add a new record to the list
    $scope.addUser= function(item) {
        users.$add(item).then(function(ref) {});
         
        // var storageRef = firebase.storage().ref('avatar/'+Date.now());
        // var storage = $firebaseStorage(storageRef);
        // var b64= $scope.croppedImage;
      

        // storage.$putString(b64, 'data_url', {contentType:'image/jpg'}).$complete(function(snapshot) {
        //     console.log(snapshot.downloadURL);
        //     item.imgUrl=snapshot.downloadURL;
        //     users.$add(item).then(function(ref) {
        //     });
        // });              
    }

    $scope.removeUser= function(item) {
        users.$remove(item).then(function(ref) {            
            console.log("removed");
          });
    }
    
    $scope.updateUser= function(item) {
        console.log("Saving");
        users.$save(item).then(function(ref) {            
            console.log("Saved");
          });
    }
    
    $scope.handleFileSelect = function (evt) {
        console.log( "handleFileSelect");
        var file = evt.currentTarget.files[0];
        var reader = new FileReader();
        reader.onload = function (evt) {
            $scope.$apply(function ($scope) {
                $scope.image = evt.target.result;
            });
        };
        reader.readAsDataURL(file);
    };

})
.directive('customOnFileChange', function () {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            var onChangeHandler = scope.$eval(attrs.customOnFileChange);
            element.bind('change', onChangeHandler);
        }
    };
})


.directive('customOnFileChange', function () {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            var onChangeHandler = scope.$eval(attrs.customOnFileChange);
            element.bind('change', onChangeHandler);
        }
    };
});

})();
/*

$rootScope.openSideDrawer= function() {
    window.nsWebViewInterface = new NSWebViewinterface();
    var webIface = window.nsWebViewInterface;
    
    // register listener for any event from native app
    webIface.on('anyEvent', function(eventData){
      alert(eventData);
    });
    
    // emit event to native app
    webIface.emit('anyEvent', {});
    webIface.emit('openSideDrawer');
 
// function which can be called by native app
window.moveTo = function(page, data){
    alert("moving to "+page+" withd: "+data);
}
*/



















































