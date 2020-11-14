package webserver

import (
	"fmt"
	"log"
	"net"
	"net/http"
	"sync"
	"time"

	"github.com/braintree/manners"
	"github.com/gorilla/mux"
)

type serverConfig struct {
	isRunning bool
	fileDir   string
}

var serverUrl string

var config = serverConfig{
	fileDir: "./",
}

func findAvailablePort() (int, error) {
	addr, err := net.ResolveTCPAddr("tcp", "localhost:0")
	if err != nil {
		return -1, err
	}
	l, err := net.ListenTCP("tcp", addr)
	if err != nil {
		return -1, err
	}
	defer l.Close()
	return l.Addr().(*net.TCPAddr).Port, nil
}

func ping(w http.ResponseWriter, r *http.Request) {
	fmt.Fprintln(w, "Alive!")
}

//SetConfig ...
func SetConfig(fileDir string) {
	config.fileDir = fileDir
}

//ServerUrl ...
func Url() string {
	return serverUrl
}

//IsRunning ...
func IsRunning() bool {
	return config.isRunning
}

//Start ...
func Start() (string, error) {
	if config.isRunning {
		return serverUrl, nil
	}

	log.SetPrefix("GO: ")
	r := mux.NewRouter()
	port, err := findAvailablePort()
	if err != nil {
		return "", err
	}
	r.HandleFunc("/ping", ping)
	config.isRunning = true
	var wg sync.WaitGroup
	wg.Add(1)
	go func() {
		log.Printf("Starting a serve: https://localhost:%d/ping\n", port)
		err := manners.ListenAndServe(fmt.Sprintf(":%d", port), r)
		if err != nil {
			wg.Done()
			config.isRunning = false
			log.Printf("%v\n", err)
		}
	}()
	for {
		// Small delay before we check if the server has started
		_ = time.After(100 * time.Millisecond)
		if config.isRunning {
			wg.Done()
			break
		}
	}
	wg.Wait()
	serverUrl = fmt.Sprintf("http://localhost:%d", port)
	return serverUrl, nil
}

//Stop ..
func Stop() {
	log.Printf("Stopping server...")
	config.isRunning = false
	serverUrl = ""
	go func() {
		manners.Close()
	}()
}
