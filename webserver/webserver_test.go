package webserver

import (
	"math/rand"
	"testing"
	"time"
)

// TestServer randomly starts and stops the server.
// With every start-stop, the server must provision
// a new URL
func TestServer(t *testing.T) {
	s1 := rand.NewSource(time.Now().UnixNano())
	r1 := rand.New(s1)
	for {
		select {
		case _ = <-time.After(time.Duration(r1.Intn(5)) * time.Second):
			Start()
			Stop()
		}
	}
}
