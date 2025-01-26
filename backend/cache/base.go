package cache

import (
	"sync"
	"time"
)

type CacheItem struct {
	Value      interface{}
	Expiration int64
}

type Cache struct {
	items       map[string]CacheItem
	mu          sync.RWMutex
	maxItems    int
	janitor     *time.Ticker
	stopJanitor chan bool
}

func NewCache(maxItems int, cleanupInterval time.Duration) *Cache {
	c := &Cache{
		items:       make(map[string]CacheItem),
		maxItems:    maxItems,
		janitor:     time.NewTicker(cleanupInterval),
		stopJanitor: make(chan bool),
	}

	go c.cleanupLoop()

	return c
}

func (c *Cache) cleanupLoop() {
	for {
		select {
		case <-c.janitor.C:
			c.cleanup()
		case <-c.stopJanitor:
			c.janitor.Stop()
			return
		}
	}
}

func (c *Cache) cleanup() {
	c.mu.Lock()
	defer c.mu.Unlock()

	now := time.Now().Unix()
	for key, item := range c.items {
		if item.Expiration > 0 && now > item.Expiration {
			delete(c.items, key)
		}
	}
}

func (c *Cache) Set(key string, value interface{}, duration time.Duration) {
	var expiration int64
	if duration > 0 {
		expiration = time.Now().Add(duration).Unix()
	}

	c.mu.Lock()
	defer c.mu.Unlock()

	if len(c.items) >= c.maxItems {

		for k := range c.items {

			delete(c.items, k)
			break
		}
	}

	c.items[key] = CacheItem{
		Value:      value,
		Expiration: expiration,
	}
}

func (c *Cache) Get(key string) (interface{}, bool) {
	c.mu.RLock()
	item, found := c.items[key]
	if !found {
		c.mu.RUnlock()
		return nil, false
	}

	if item.Expiration > 0 && time.Now().Unix() > item.Expiration {
		c.mu.RUnlock()
		c.mu.Lock()
		delete(c.items, key)
		c.mu.Unlock()
		return nil, false
	}

	c.mu.RUnlock()
	return item.Value, true
}

func (c *Cache) Delete(key string) {
	c.mu.Lock()
	defer c.mu.Unlock()
	delete(c.items, key)
}

func (c *Cache) Clear() {
	c.mu.Lock()
	defer c.mu.Unlock()
	c.items = make(map[string]CacheItem)
}

func (c *Cache) Close() {
	c.stopJanitor <- true
}
