package v1

import (
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/labstack/echo/v4"
	"github.com/usememos/memos/api/auth"
	"github.com/usememos/memos/common/util"
	"github.com/usememos/memos/store"
)

func (s *APIV1Service) registerMemoHookRoutes(g *echo.Group) {
	g.GET("/memohook", s.GetMemoHookList)
	g.POST("/memohook", s.CreateMemoHook)
	g.DELETE("/memohook/:hookId", s.DeleteMemoHook)
}

func (s *APIV1Service) CreateMemoHook(c echo.Context) error {
	memoHook := &store.MemoHook{}
	if err := json.NewDecoder(c.Request().Body).Decode(&memoHook); err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, "Malformatted post hook request").SetInternal(err)
	}

	userID, ok := c.Get(auth.UserIDContextKey).(int32)
	if !ok {
		return echo.NewHTTPError(http.StatusUnauthorized, "Missing user in session")
	}

	memoHook.CreatorID = userID

	hook, err := s.Store.CreateMemoHook(c.Request().Context(), memoHook)
	if err != nil {
		return echo.NewHTTPError(http.StatusInternalServerError, "Failed to create hook").SetInternal(err)
	}

	return c.JSON(http.StatusOK, hook)
}

func (s *APIV1Service) DeleteMemoHook(c echo.Context) error {
	ctx := c.Request().Context()
	userId, ok := c.Get(auth.UserIDContextKey).(int32)
	if !ok {
		return echo.NewHTTPError(http.StatusUnauthorized, "Missing user in session")
	}
	hookId, err := util.ConvertStringToInt32(c.Param("hookId"))
	if err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, fmt.Sprintf("ID is not a number: %s", c.Param("hookId"))).SetInternal(err)
	}

	if err := s.Store.DeleteMemoHook(ctx, &store.DeleteMemoHook{
		ID:        hookId,
		CreatorId: userId,
	}); err != nil {
		return echo.NewHTTPError(http.StatusInternalServerError, fmt.Sprintf("Failed to delete hook ID: %v", hookId)).SetInternal(err)
	}

	return c.JSON(http.StatusOK, true)
}

func (s *APIV1Service) GetMemoHookList(c echo.Context) error {
	ctx := c.Request().Context()
	userID, ok := c.Get(auth.UserIDContextKey).(int32)
	if !ok {
		return echo.NewHTTPError(http.StatusUnauthorized, "Missing user in session")
	}
	hooks, err := s.Store.FindMemoHooks(ctx, &store.MemoHook{
		CreatorID: userID,
	})
	if err != nil {
		return echo.NewHTTPError(http.StatusInternalServerError, "Failed to get memo hooks").SetInternal(err)
	}
	return c.JSON(http.StatusOK, hooks)
}
