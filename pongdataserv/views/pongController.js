
var pongController = angular.module('pongController', ['ui.bootstrap']);

pongController.controller('PongControl', ['$scope', '$http', '$q', 
    function PongControl($scope, $http, $q) {
        $scope.base_url = 'http://jacobra.com:8086';

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
            var pointpie = new Chart(ctx).Pie(data, { animation : false});


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
            var winpie = new Chart(ctx).Pie(data, { animation : false});

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
        
            for (var i=0; i<history.length; i++){
                if (i%5 == 1){
                    rallies.push(String(i));
                } else {
                    rallies.push("");
                }
                if (history[i]['point'] == p1){
                    p1currscore++;
                }
                else{
                    p2currscore++;
                }
                p1data.push(p1currscore);
                p2data.push(p2currscore);
            }

            

            var data = {
                labels : rallies,
                datasets : [
                    {
                        fillColor : "rgba(255,100,100,0.3)",
                        pointColor : "#faa",
                        strokeColor : "rgba(251,187,188,1)",
                        pointStrokeColor : "#faa",
                        data : p1data,
                        title : $scope.p1
                    },
                    {
                        fillColor : "rgba(111,117,255,0.3)",
                        pointColor : "rgba(200,200,255,1)",
                        strokeColor : "rgba(155,187,205,1)",
                        pointStrokeColor : "#33f",
                        data : p2data,
                        title : $scope.p2
                    }
                ]
            }
            options = {
                scaleOverride : true,
                scaleSteps : Math.max(p1currscore,p2currscore),
                scaleStepWidth : 1,
                scaleStartValue : 0,
                animation : false,
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
            for (var i=0; i<$scope.alldata.length; i++){
                var game = $scope.alldata[i];
                if ( game['game_over'] && game['player1'] == $scope.p1 && game['player2'] == $scope.p2){
                    $scope.gamedates.push(game['start_time']);
                }
            }
            $scope.gamedates.sort().reverse();
            $scope.gamedate = $scope.gamedates[0];
        }

        $scope.calculate_days = function(){
            $scope.days = [];
            for (var i=0; i<$scope.alldata.length;i++){
                var game = $scope.alldata[i];
                //get a list of unique days
                var curr_day = game['start_time'].split(' ')[0];
                if ($scope.days.indexOf(curr_day) == -1 &&
                    game['game_over'] &&
                    game['player1'] == $scope.p1 &&
                    game['player2'] == $scope.p2){
                        $scope.days.push(curr_day);
                }
            }
            $scope.days.sort().reverse();
        }

        $scope.generate_data_by_date = function(){
            $scope.days = [];
            $scope.databydate = {};
            for (var i=0; i<$scope.alldata.length;i++){
                var game = $scope.alldata[i];
                if (game['game_over']){
                    $scope.databydate[game['start_time']] = game;
                }
            }
            $scope.days.sort().reverse();
        }

        $scope.draw_day_charts = function(){
            $scope.day_game_data = [];
            for (var i=0; i<$scope.alldata.length; i++){
                var currgame = $scope.alldata[i];
                if (currgame['start_time'].indexOf($scope.day_stats) == 0 &&
                    $scope.alldata[i]['player1'] == $scope.p1 &&
                    $scope.alldata[i]['player2'] == $scope.p2){
                        //console.log(currgame['start_time'] + ', '+ currgame['winner']); 
                        $scope.day_game_data.push(currgame);
                }

            }

            var p1 = $scope.p1;
            var p2 = $scope.p2;

            var wins = [0, 0, 0];
            var points = [0, 0, 0];

            for (var i = 0; i<$scope.day_game_data.length; i++){
                if ( $scope.day_game_data[i]["game_over"] == true ){
                    points[0] = points[0] + $scope.day_game_data[i][p1];
                    points[1] = points[1] + $scope.day_game_data[i][p2];
                    if ($scope.day_game_data[i]['winner'] == p1){
                        wins[0]++;
                    }
                    else if ($scope.day_game_data[i]["winner"] == p2){
                        wins[1]++;
                    }
                    else{
                        wins[2]++;
                    }
                }
            }

            $scope.day_win_count = wins[0]+wins[1];
            $scope.day_point_count = points[0]+points[1];
            
            var win_data = [
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
            var ctx = document.getElementById("dayWinPieChart").getContext("2d");
            var daywinpie = new Chart(ctx).Pie(win_data, {animation : false});
                
            
            var point_data = [
                {
                    value: points[0],
                    color:"#F38630",
                    label: p1 + ": "+points[0]
                },
                {
                    value : points[1],
                    color : "#E0E4CC",
                    label: p2 + ": "+points[1]
                },
                {
                    value : points[2],
                    color : "#69D2E7",
                    label: "error" + ": "+points[2]
                }           
            ]

 
            //Get the context of the canvas element we want to select
            var ctx = document.getElementById("dayPointPieChart").getContext("2d");
            var daypointpie = new Chart(ctx).Pie(point_data, {animation : false});
        }

        $scope.draw_game_wins_over_time = function(){
            var rallies = []
            var p1wins = [];
            var p2wins = [];
            var p1currwins = 0;
            var p2currwins = 0;

            for (var i = 0; i<$scope.alldata.length; i++){
                if ($scope.alldata[i]["game_over"] == true &&
                    $scope.alldata[i]['player1'] == $scope.p1 &&
                    $scope.alldata[i]['player2'] == $scope.p2){
                    

                    if ($scope.alldata[i]['winner'] == $scope.p1){
                        p1currwins++;
                    }
                    else if ($scope.alldata[i]["winner"] == $scope.p2){
                        p2currwins++;
                    }
                    p1wins.push(p1currwins);
                    p2wins.push(p2currwins);
                }

            }

            for (var i=0; i<(p1currwins+p2currwins); i++){
                if (i%5 == 1){
                    rallies.push(String(i));
                } else {
                    rallies.push("");
                }
            }

            var data = {
                labels : rallies,
                datasets : [
                    {
                        fillColor : "rgba(151,187,205,0.3)",
                        strokeColor : "rgba(151,187,205,1)",
                        pointColor : "rgba(151,187,205,1)",
                        pointStrokeColor : "#fff",
                        data : p2wins,
                        title : $scope.p2
                    },
                    {
                        fillColor : "rgba(255,200,200,0.7)",
                        //fillColor : "#faa",
                        strokeColor : "#faa",
                        pointColor : "#faa",
                        pointStrokeColor : "#fff",
                        data : p1wins,
                        title : $scope.p1
                    },
                ]
            }
            options = {
                scaleOverride : true,
                scaleSteps : Math.max(p1currwins,p2currwins),
                scaleStepWidth : 1,
                scaleStartValue : 0,
                animation : false,
            }

            var ctx = document.getElementById("gameWinsLineChart").getContext("2d");
            legend(document.getElementById("gameWinsLineLegend"), data);
            new Chart(ctx).Line(data,options);

        }

        $scope.redraw_graphs = function(){
            $scope.calculate_days();
            $scope.calculate_gamedates();
            $scope.calculate_wins();
            $scope.calculate_points();
            $scope.draw_game_chart();
            $scope.draw_day_charts();
            $scope.draw_game_wins_over_time();
        }

        $scope.get_all_data = function(){
            var url = $scope.base_url + "/alldata";
            $http({method: 'GET', url:url}).
            success(function(data, status, headers, config) {
                $scope.alldata = data;
                $scope.generate_data_by_date();
                $scope.generate_players();
                $scope.redraw_graphs();
                $scope.day_stats = $scope.days[0];

            }).
            error(function(data, status, headers, config) {
                console.log(data);
            }); 
        }
        
        $scope.init();
        
        $scope.$watch('gamedate', function(){
            $scope.draw_game_chart();
        });
        
        $scope.$watch('[p1,p2,day_stats]', function(){
            if ($scope.p1 != $scope.p2){
                $scope.generate_data_by_date();
                $scope.redraw_graphs();    
            } 
        }, true);
        
        $scope.$watch('[p1,p2]', function(){
            $scope.day_stats = $scope.days[0];
        }, true);
    }]);

