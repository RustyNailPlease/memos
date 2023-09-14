package service

import (
	"bytes"
	"context"
	"crypto/tls"
	"encoding/json"
	"net/http"
	"time"

	v1 "github.com/usememos/memos/api/v1"
	"github.com/usememos/memos/common/log"
	"github.com/usememos/memos/store"
)

type HookCaller struct {
	ctx   context.Context
	Store *store.Store

	Triggers chan store.HookTrigger

	httpClient *http.Client
}

type HookData[T any] struct {
	Type store.HookType
	Data T
}

func (hc *HookCaller) Run() {
	log.Info("start hook runner")
	for t := range store.HookTriggers {
		go hc.call(t.MemoID, t.MemoCreator, t.HookType)
	}
}

func (hc *HookCaller) call(memoID int32, creatorID int32, hookType store.HookType) {
	// magic
	time.Sleep(10 * time.Second)

	if hookType == store.HOOK_DELETED {
		hooks, err := hc.Store.FindMemoHooks(hc.ctx, &store.MemoHook{CreatorID: creatorID})

		if err != nil {
			log.Error(err.Error())
			return
		}

		if len(hooks) == 0 {
			return
		}

		hc.callHookURLDEL(hooks, &v1.Memo{
			ID: memoID,
		})
		return
	}

	memo, err := hc.Store.GetMemo(hc.ctx, &store.FindMemo{ID: &memoID})
	if err != nil {
		log.Error(err.Error())
		return
	}

	hooks, err := hc.Store.FindMemoHooks(hc.ctx, &store.MemoHook{CreatorID: memo.CreatorID})
	if err != nil {
		log.Error(err.Error())
		return
	}
	if len(hooks) == 0 {
		return
	}

	memoResponse := &v1.Memo{
		ID:         memo.ID,
		RowStatus:  v1.RowStatus(memo.RowStatus.String()),
		CreatorID:  memo.CreatorID,
		CreatedTs:  memo.CreatedTs,
		UpdatedTs:  memo.UpdatedTs,
		Content:    memo.Content,
		Visibility: v1.Visibility(memo.Visibility.String()),
		Pinned:     memo.Pinned,
	}

	list, err := hc.Store.ListResources(hc.ctx, &store.FindResource{
		MemoID: &memoID,
	})
	if err != nil {
		log.Error(err.Error())
		return
	}
	resourceList := []*v1.Resource{}
	for _, resource := range list {
		resourceList = append(resourceList, v1.ConvertResourceFromStore(resource))
	}

	memoResponse.ResourceList = resourceList

	if hookType == store.HOOK_ADD {
		hc.callHookURLAdd(hooks, memoResponse)
		return
	}

	if hookType == store.HOOK_MODIFIED {
		hc.callHookURLMod(hooks, memoResponse)
	}

}

func (hc *HookCaller) callHookURLAdd(hooks []store.MemoHook, memo *v1.Memo) {
	for _, hook := range hooks {
		data := HookData[v1.Memo]{
			Data: *memo,
			Type: store.HOOK_ADD,
		}
		buf, err := json.Marshal(data)
		if err != nil {
			log.Error(err.Error())
			continue
		}
		req, err := http.NewRequest(http.MethodPost, hook.Url, bytes.NewBuffer(buf))
		if err != nil {
			log.Error(err.Error())
			continue
		}
		// retry
		_, err = hc.httpClient.Do(req)
		if err != nil {
			continue
		}
	}
}

func (hc *HookCaller) callHookURLMod(hooks []store.MemoHook, memo *v1.Memo) {
	for _, hook := range hooks {
		data := HookData[v1.Memo]{
			Data: *memo,
			Type: store.HOOK_MODIFIED,
		}
		buf, err := json.Marshal(data)
		if err != nil {
			log.Error(err.Error())
			continue
		}
		req, err := http.NewRequest(http.MethodPost, hook.Url, bytes.NewBuffer(buf))
		if err != nil {
			log.Error(err.Error())
			continue
		}
		// retry
		_, err = hc.httpClient.Do(req)
		if err != nil {
			continue
		}
	}
}

func (hc *HookCaller) callHookURLDEL(hooks []store.MemoHook, memo *v1.Memo) {
	for _, hook := range hooks {
		data := HookData[v1.Memo]{
			Data: *memo,
			Type: store.HOOK_DELETED,
		}
		buf, err := json.Marshal(data)
		if err != nil {
			log.Error(err.Error())
			continue
		}
		req, err := http.NewRequest(http.MethodPost, hook.Url, bytes.NewBuffer(buf))
		if err != nil {
			log.Error(err.Error())
			continue
		}
		// retry
		_, err = hc.httpClient.Do(req)
		if err != nil {
			continue
		}
	}
}

// func callHookUrlEnable(hooks []store.MemoHook, memo *store.Memo) {
// todo
// }

// func callHookUrlDisable(hooks []store.MemoHook, memo *store.Memo) {
// todo
// }

func NewHookCaller(ctx context.Context, st *store.Store) *HookCaller {

	store.HookTriggers = make(chan store.HookTrigger, 1)

	return &HookCaller{
		ctx:   ctx,
		Store: st,
		httpClient: &http.Client{
			Transport: &http.Transport{
				TLSClientConfig: &tls.Config{
					InsecureSkipVerify: true,
				},
			},
		},
	}
}
