
var pongController = angular.module('pongController', ['ui.bootstrap']);

pongController.controller('PongControl', ['$scope', '$http', '$q', 
    function PongControl($scope, $http, $q) {
        $scope.base_url = 'http://ec2-54-186-165-220.us-west-2.compute.amazonaws.com:8086';

        $scope.init = function(){
            $scope.get_all_data();
        }


        $scope.calculate_points = function(){
            var p1 = $scope.p1;
            var p2 = $scope.p2;

            var points = {};
            points[p1] = 0;
            points[p2] = 0;

            for (var i = 0; i<$scope.alldata.length; i++){
                if ($scope.alldata[i]["game_over"] == true &&
                    $scope.alldata[i]['player1'] == p1 &&
                    $scope.alldata[i]['player2'] == p2){
                    points[p1] = points[p1] + $scope.alldata[i][p1];
                    points[p2] = points[p2] + $scope.alldata[i][p2];
                }
            }
            $scope.pointcount = points[p1]+points[p2];
       
            var data = [
                {
                    value: points[p1],
                    color:"#F38630",
                    label: p1 + ": " + points[p1]
                },
                {
                    value : points[p2],
                    color : "#E0E4CC",
                    label: p2 + ": " + points[p2]
                }
            ]

 
            //Get the context of the canvas element we want to select
            var ctx = document.getElementById("pointPieChart").getContext("2d");
            var pointpie = new Chart(ctx).Pie(data, {});


        }

        $scope.calculate_wins = function(){
            var p1 = $scope.p1;
            var p2 = $scope.p2;

            wins = [0, 0, 0];

            for (var i = 0; i<$scope.alldata.length; i++){
                if ($scope.alldata[i]["game_over"] == true &&
                    $scope.alldata[i]['player1'] == p1 &&
                    $scope.alldata[i]['player2'] == p2){
                    

                    if ($scope.alldata[i]['winner'] == p1){
                        wins[0]++;
                    }
                    else if ($scope.alldata[i]["winner"] == p2){
                        wins[1]++;
                    }
                    else{
                        wins[2]++;
                    }
                }
            }
            
            $scope.gamecount = wins[0]+wins[1];
       
            var data = [
                {
                    value: wins[0],
                    color:"#F38630",
                    label: p1 + ": "+wins[0]
                },
                {
                    value : wins[1],
                    color : "#E0E4CC",
                    label: p2 + ": "+wins[1]
                },
                {
                    value : wins[2],
                    color : "#69D2E7",
                    label: "error" + ": "+wins[2]
                }           
            ]

 
            //Get the context of the canvas element we want to select
            var ctx = document.getElementById("winPieChart").getContext("2d");
            var winpie = new Chart(ctx).Pie(data, {});


        }
    
        $scope.draw_game_chart = function(){
            try{ var game = $scope.databydate[$scope.gamedate];}
            catch(err){ return; }
            var history = game['history'];

            var p1 = $scope.p1;
            var p2 = $scope.p2;
            var rallies = []
            var p1data = [];
            var p2data = [];
            var p1currscore = 0;
            var p2currscore = 0;
        
            console.log(history);   
     
            for (var i=0; i<history.length; i++){
                rallies.push(String(i));
                if (history[i]['point'] == p1){
                    p1currscore++;
                }
                else{
                    p2currscore++;
                }
                p1data.push(p1currscore);
                p2data.push(p2currscore);
            }

            firstdraw = null;
            seconddraw = null;
            firstdrawtitle = null;
            seconddrawtitle = null;
            
            if (game["winner"] == p1){
                firstdraw = p1data; 
                seconddraw = p2data;
                firstdrawtitle = p1;
                seconddrawtitle = p2;
            }
            else{
                firstdraw = p2data; 
                seconddraw = p1data;
                firstdrawtitle = p2;
                seconddrawtitle = p1;
            }
            

            var data = {
                labels : rallies,
                datasets : [
                    {
                        //fillColor : "rgba(220,220,220,0.5)",
                        fillColor : "#faa",
                        strokeColor : "#faa",
                        pointColor : "#faa",
                        pointStrokeColor : "#fff",
                        data : firstdraw,
                        title : firstdrawtitle
                    },
                    {
                        fillColor : "rgba(151,187,205,0.5)",
                        strokeColor : "rgba(151,187,205,1)",
                        pointColor : "rgba(151,187,205,1)",
                        pointStrokeColor : "#fff",
                        data : seconddraw,
                        title : seconddrawtitle
                    }
                ]
            }
            options = {
                scaleOverride : true,
                scaleSteps : Math.max(p1currscore,p2currscore),
                scaleStepWidth : 1,
                scaleStartValue : 0,
            }

            var ctx = document.getElementById("gameLineChart").getContext("2d");
            legend(document.getElementById("gameLineLegend"), data);
            ctx.save();
            new Chart(ctx).Line(data,options);
            ctx.restore();

            ctx.save();
            ctx.translate(0,0);
            //ctx.rotate(-Math.PI/2);
            ctx.textAlign = "center";
            ctx.font="30px Arial";
            ctx.fillText("Score", 200, 200);
            ctx.restore();
        }

        $scope.generate_players = function(){
            $scope.players = [];
            for (var i = 0; i < $scope.alldata.length; i++){
                var game = $scope.alldata[i];
                var p1 = game['player1'];
                var p2 = game['player2'];
                if ($scope.players.indexOf(p1) == -1){
                    $scope.players.push(p1);
                }
                if ($scope.players.indexOf(p2) == -1){
                    $scope.players.push(p2);
                }
            }
            $scope.p1 = "Loth";
            $scope.p2 = "Jacobra";
            
        }
        
        $scope.calculate_gamedates = function(){
            $scope.gamedates = [];
            for (var i=0; i<$scope.alldata.length;i++){
                var game = $scope.alldata[i];
                if ( game['game_over'] && game['player1'] == $scope.p1 && game['player2'] == $scope.p2){
                    $scope.gamedates.push(game['start_time']);
                }
            }
            $scope.gamedates.sort().reverse();
            $scope.gamedate = $scope.gamedates[0];
        }

        $scope.generate_data_by_date = function(){
            $scope.databydate = {};
            for (var i=0; i<$scope.alldata.length;i++){
                var game = $scope.alldata[i];
                if (game['game_over']){
                    $scope.databydate[game['start_time']] = game;
                }
            }
        }

        $scope.redraw_graphs = function(){
            $scope.calculate_gamedates();
            $scope.calculate_wins();
            $scope.calculate_points();
            $scope.draw_game_chart();
        }

        $scope.get_all_data = function(){
            var url = $scope.base_url + "/alldata";
            $http({method: 'GET', url:url}).
            success(function(data, status, headers, config) {
                $scope.alldata = data;
                $scope.generate_data_by_date();
                $scope.generate_players();
                $scope.redraw_graphs();

            }).
            error(function(data, status, headers, config) {
                console.log(data);
            }); 
        }
        
        $scope.init();
        
        $scope.$watch('gamedate', function(){
            $scope.draw_game_chart();
        });

        $scope.$watch('[p1,p2]', function(){
            if ($scope.p1 != $scope.p2){
                $scope.redraw_graphs();    
            } 
        }, true);
    }]);

