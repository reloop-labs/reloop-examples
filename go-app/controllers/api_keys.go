package controllers

import (
	"encoding/json"
	"net/http"
	"strconv"
	"strings"

	reloop "github.com/reloop-labs/reloop-go/v2"
)

type ApiKeysController struct {
	Client *reloop.Client
}

func NewApiKeysController(client *reloop.Client) *ApiKeysController {
	return &ApiKeysController{Client: client}
}

func jsonResponse(w http.ResponseWriter, status int, data interface{}) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	json.NewEncoder(w).Encode(map[string]interface{}{
		"success": status >= 200 && status < 300,
		"data":    data,
	})
}

func jsonError(w http.ResponseWriter, status int, message string) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	json.NewEncoder(w).Encode(map[string]interface{}{
		"success": false,
		"error":   message,
	})
}

// 1 & 2. /api/api-keys (POST = Create, GET = List)
func (c *ApiKeysController) HandleRoot(w http.ResponseWriter, r *http.Request) {
	switch r.Method {
	case http.MethodPost:
		var req struct {
			Name string `json:"name"`
		}
		if err := json.NewDecoder(r.Body).Decode(&req); err != nil || req.Name == "" {
			jsonError(w, http.StatusBadRequest, "Name is required")
			return
		}

		result, err := c.Client.ApiKeys.Create(reloop.CreateApiKeyParams{
			Name: req.Name,
		})
		if err != nil {
			jsonError(w, http.StatusBadRequest, err.Error())
			return
		}
		jsonResponse(w, http.StatusCreated, result)

	case http.MethodGet:
		page, _ := strconv.Atoi(r.URL.Query().Get("page"))
		limit, _ := strconv.Atoi(r.URL.Query().Get("limit"))
		if page <= 0 {
			page = 1
		}
		if limit <= 0 {
			limit = 10
		}

		result, err := c.Client.ApiKeys.List(&reloop.ApiKeyListParams{
			Page:  &page,
			Limit: &limit,
		})
		if err != nil {
			jsonError(w, http.StatusBadRequest, err.Error())
			return
		}
		jsonResponse(w, http.StatusOK, result)

	default:
		jsonError(w, http.StatusMethodNotAllowed, "Method not allowed")
	}
}

// 3, 4, 5, 6, 7, 8. /api/api-keys/{id} [actions: /disable, /enable, /rotate]
func (c *ApiKeysController) HandleByID(w http.ResponseWriter, r *http.Request) {
	path := strings.TrimPrefix(r.URL.Path, "/api/api-keys/")
	parts := strings.Split(path, "/")
	id := parts[0]

	if id == "" {
		jsonError(w, http.StatusBadRequest, "Key ID required")
		return
	}

	// Actions (/disable, /enable, /rotate)
	if len(parts) > 1 {
		action := parts[1]
		switch action {
		case "disable":
			result, err := c.Client.ApiKeys.Disable(id)
			if err != nil {
				jsonError(w, http.StatusBadRequest, err.Error())
				return
			}
			jsonResponse(w, http.StatusOK, result)

		case "enable":
			result, err := c.Client.ApiKeys.Enable(id)
			if err != nil {
				jsonError(w, http.StatusBadRequest, err.Error())
				return
			}
			jsonResponse(w, http.StatusOK, result)

		case "rotate":
			result, err := c.Client.ApiKeys.Rotate(id)
			if err != nil {
				jsonError(w, http.StatusBadRequest, err.Error())
				return
			}
			jsonResponse(w, http.StatusOK, result)

		default:
			jsonError(w, http.StatusNotFound, "Action not found")
		}
		return
	}

	// CRUD operations by ID
	switch r.Method {
	case http.MethodGet:
		result, err := c.Client.ApiKeys.Get(id)
		if err != nil {
			jsonError(w, http.StatusBadRequest, err.Error())
			return
		}
		jsonResponse(w, http.StatusOK, result)

	case http.MethodPatch:
		var req struct {
			Name string `json:"name"`
		}
		if err := json.NewDecoder(r.Body).Decode(&req); err != nil || req.Name == "" {
			jsonError(w, http.StatusBadRequest, "Name is required")
			return
		}

		result, err := c.Client.ApiKeys.Update(id, reloop.UpdateApiKeyParams{
			Name: req.Name,
		})
		if err != nil {
			jsonError(w, http.StatusBadRequest, err.Error())
			return
		}
		jsonResponse(w, http.StatusOK, result)

	case http.MethodDelete:
		result, err := c.Client.ApiKeys.Delete(id)
		if err != nil {
			jsonError(w, http.StatusBadRequest, err.Error())
			return
		}
		jsonResponse(w, http.StatusOK, result)

	default:
		jsonError(w, http.StatusMethodNotAllowed, "Method not allowed")
	}
}
