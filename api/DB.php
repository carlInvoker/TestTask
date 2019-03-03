<?php

const columns = array( 
    0 =>'emp_no', 
    1 => 'first_name',
    2=> 'last_name',
    3=> 'birth_date'
);

class DB {

    private $db;
    public $user;

    function __construct() {
        // opening db connection
        $this->pdo = new PDO("mysql:dbname=" . Config::$DB_NAME, Config::$DB_USERNAME, Config::$DB_PASSWORD, array(PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8"));
        $this->fpdo = new FluentPDO($this->pdo);

        $this->fpdo->debug = function($BaseQuery) {
            echo "query: " . $BaseQuery->getQuery(false) . "\n";
            echo "parameters: " . implode(', ', $BaseQuery->getParameters()) . "\n";
            echo "full query:" . vsprintf(str_replace("?", "\"%s\"", $BaseQuery->getQuery(false)), $BaseQuery->getParameters());
            echo "rowCount: " . $BaseQuery->getResult()->rowCount() . "\n";
            // time is impossible to test (each time is other)
            echo $BaseQuery->getTime() . "\n";
        };
        $this->fpdo->debug = null;
    }

    /**
     * Select all employees
     * @return array $result - array of employees
     */
    
    
    public function getDataCount() {
        $totalData = $this
            ->fpdo
            ->from('employees')
            ->select(null)
            ->select('COUNT(*)')
            ->fetch('COUNT(*)');
        
           return $totalData;
    }
    
    public function getSelectData($requestData) {
        $query = $this
            ->fpdo
            ->from('employees')
            ->select(null)
            ->select("emp_no, first_name, last_name, DATE_FORMAT(birth_date,'%a %b %d %Y') AS birth_date")
            ->orderBy(columns[$requestData['order'][0]['column']]."   ".$requestData['order'][0]['dir'])
            ->limit($requestData['length'])
            ->offset($requestData['start']);          
        
        return $query;
    }
    
    public function getSearchResult($requestData) {
        $query = $this
                ->fpdo
                ->from('employees')
                ->select(null)
                ->select("emp_no, first_name, last_name, DATE_FORMAT(birth_date,'%a %b %d %Y') AS birth_date")
                ->where("emp_no LIKE '%" . $requestData['search']['value'] .
                     "%' OR first_name LIKE '%" . $requestData['search']['value'] .
                     "%' OR last_name LIKE '%" . $requestData['search']['value'] . 
                     "%' OR DATE_FORMAT(birth_date,'%a %b %d %Y') LIKE '%" . $requestData['search']['value'] .
                     "%' OR DATE_FORMAT(birth_date,'%a %b %Y %d') LIKE '%" . $requestData['search']['value'] .   
                     "%' OR DATE_FORMAT(birth_date,'%Y %a %b %d') LIKE '%" . $requestData['search']['value'] .
                     "%'   ")     
                 ->orderBy(columns[$requestData['order'][0]['column']]."   ".$requestData['order'][0]['dir']);          
        
        $data['totalFiltered'] =  $query->count();
        $query->limit($requestData['length'])
              ->offset($requestData['start']);
        $data['query'] = $query;
        return $data;
    }
    
}
    