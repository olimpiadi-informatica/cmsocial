'use strict';

/* Tasks page */

angular.module('cmsocial').controller('TaskTree', function(
    $scope, $stateParams, $state, $http, notificationHub,
    userManager, l10n, API_PREFIX) {
        $http
        .post(API_PREFIX + 'task', {
            'tag' : 'tree', // can be null
            'first' : 0,
            'last' : 50,
            'username' : userManager.getUser().username,
            'token' : userManager.getUser().token,
            'action' : 'list'
        })
        .success(function(data, status, headers, config) {
            $scope.tasks = data['tasks'];
            //console.log(data.tasks);

            //Static declaration of needed fields
            var extra_fields = {
                'hello': {difficulty: 1, category: 'intro'},
                'somma': {difficulty: 2, category: 'intro'},
                'easy1': {difficulty: 3, category: 'intro'},
                'trasposta': {difficulty: 1, category: 'data structures'},
                'socks': {difficulty: 2, category: 'data structures'},
                'parentesi': {difficulty: 3, category: 'data structures'},
                'matrice': {difficulty: 4, category: 'data structures'},
                'interrogazioni': {difficulty: 5, category: 'data structures'},
                'sunny': {difficulty: 1, category: 'graphs'},
                'ponti': {difficulty: 2, category: 'graphs'},
                'mincammino': {difficulty: 3, category: 'graphs'},
                'estintori': {difficulty: 4, category: 'graphs'},
                'tecla': {difficulty: 5, category: 'graphs'},
                'easy3': {difficulty: 1, category: 'math'},
                'mcd': {difficulty: 2, category: 'math'},
                'fraction': {difficulty: 3, category: 'math'},
                'cc': {difficulty: 4, category: 'math'},
                'baricentro': {difficulty: 5, category: 'math'},
                'fibonacci': {difficulty: 1, category: 'dynamic programming'},
                'poldo': {difficulty: 2, category: 'dynamic programming'},
                'sequenceofballs': {difficulty: 3, category: 'dynamic programming'},
                'seti': {difficulty: 4, category: 'dynamic programming'},
                'bitcoin2': {difficulty: 5, category: 'dynamic programming'},
                'easy2': {difficulty: 1, category: 'brute force'},
                'contdivisori': {difficulty: 2, category: 'brute force'},
                'parole': {difficulty: 3, category: 'brute force'},
                'painting': {difficulty: 4, category: 'brute force'},
                'quasipal': {difficulty: 5, category: 'brute force'},
                'ordina': {difficulty: 1, category: 'sortings'},
                'hamtaro': {difficulty: 2, category: 'sortings'},
                'dreamteam': {difficulty: 3, category: 'sortings'},
                'annoluce': {difficulty: 4, category: 'sortings'},
                'terrazzamenti': {difficulty: 5, category: 'sortings'}
            };

            //Build the tree according to the level of the tasks
            var t = [];
            
            for (var i = 0; i < data.tasks.length; i++) {
                if (data.tasks[i].name in extra_fields) {  
                    t.push(data.tasks[i]);
                    t[t.length-1].difficulty = extra_fields[data.tasks[i].name].difficulty;
                    t[t.length-1].category = extra_fields[data.tasks[i].name].category;
                }
            } 
                       
            function onlyUnique(value, index, self) { 
                return self.indexOf(value) === index;
            }

            var catList = []
            var t2 = {}
            for (var i = 0; i < t.length; i++) {
                catList.push(t[i].category);
                if (!(t[i].category in t2)) {
                    t2[t[i].category] = [];
                }
                t2[t[i].category].push(t[i]);
            }
            catList = catList.filter(onlyUnique);
            
            function cmp(a, b) {
                if (a.difficulty > b.difficulty) {
                    return 1;
                }
                if (a.difficulty < b.difficulty) {
                    return -1;
                }
                return 0;
            }

            t2["intro"].sort(cmp);
            var treeData = {
                "name": t2["intro"][0].name,
                "parent": "null",
                "children": []
            };

            var par = treeData;
            for (var j = 1; j < t2["intro"].length; j++) {
                var cur = {
                    "name": t2["intro"][j]["name"],
                    "parent": par["name"],
                    "children": []
                };
                par["children"].push(cur);
                par = cur;
            }
            var secondRoot = par;

            for (var i = 0; i < catList.length; i++) {
                if (catList[i] == "intro") {
                    continue;
                }
                t2[catList[i]].sort(cmp);
                var par = secondRoot;
                for (var j = 0; j < t2[catList[i]].length; j++) {
                    var cur = {
                        "name": t2[catList[i]][j]["name"],
                        "parent": par["name"],
                        "children": []
                    };
                    par["children"].push(cur);
                    par = cur;
                }
            }
              
            // ************** Generate the tree diagram	 *****************
            var margin = {top: 40, right: 120, bottom: 20, left: 120},
                width = 960 - margin.right - margin.left,
                height = 800 - margin.top - margin.bottom;
                
            var i = 0;
            
            var tree = d3.layout.tree()
                .size([height, width]);
            
            var diagonal = d3.svg.diagonal()
                .projection(function(d) { return [d.x, d.y]; });
            
            var svg = d3.select("gemmadiv").append("svg")
                .attr("width", width + margin.right + margin.left)
                .attr("height", height + margin.top + margin.bottom)
            .append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
            
            var root = treeData;
            
            update(root);
            
            function update(source) {
            
            // Compute the new tree layout.
            var nodes = tree.nodes(root).reverse(),
                links = tree.links(nodes);
            
            // Normalize for fixed-depth.
            nodes.forEach(function(d) { d.y = d.depth * 100; });
            
            // Declare the nodes
            var node = svg.selectAll("g.node")
                .data(nodes, function(d) { return d.id || (d.id = ++i); });
            
            // Enter the nodes.
            var nodeEnter = node.enter().append("g")
                .attr("class", "node")
                .attr("transform", function(d) { 
                    return "translate(" + d.x + "," + d.y + ")"; });

                    
            var singleChart = nodeEnter.append("single-chart");
            /*var svg1 = document.createElementNS("http://www.w3.org/2000/svg", "svg");
            svg1.setAttribute("viewBox", "0 0 36 36")
            svg1.setAttribute("class", "circular-chart orange");
            singleChart.append(svg1);*/

            var path1 = d3.path();
            path1.setAttribute("class", "circle-bg");
            path1.setAttribute("d", "M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831");
            svg.append(path1);

            var path2 = d3.path();
            path2.setAttribute("class", "circle");
            path2.setAttribute("stroke-dasharray", "30, 100");
            path2.setAttribute("d", "M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831");
            svg.append(path2);

            /*<div class="single-chart">
                <svg viewBox="0 0 36 36" class="circular-chart orange">
                    <path class="circle-bg"
                    d="M18 2.0845
                        a 15.9155 15.9155 0 0 1 0 31.831
                        a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    <path class="circle"
                    stroke-dasharray="30, 100"
                    d="M18 2.0845
                        a 15.9155 15.9155 0 0 1 0 31.831
                        a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    <text x="18" y="20.35" class="percentage">30%</text>
                </svg>
            </div>*/
            /*nodeEnter.append("circle")
                .attr("r", 10)
                .style("fill", "#fff")
                .style("stroke", "red");*/
            
            nodeEnter.append("text")
                .attr("y", function(d) { 
                    return d.children || d._children ? -18 : 18; })
                .attr("dy", ".35em")
                .attr("text-anchor", "middle")
                .text(function(d) { return d.name; })
                .style("fill-opacity", 1);
            
            // Declare the links…
            var link = svg.selectAll("path.link")
                .data(links, function(d) { return d.target.id; });
            
            // Enter the links.
            link.enter().insert("path", "g")
                .attr("class", "link")
                .attr("d", diagonal);
            
            }
        })
        .error(function(data, status, headers, config) {
            notificationHub.serverError(status);
        });
    }
);
