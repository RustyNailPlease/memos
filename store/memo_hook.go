package store

import (
	"context"
	"strings"
)

type MemoHook struct {
	ID        int32
	Name      string
	Url       string
	CreatorID int32
}

type DeleteMemoHook struct {
	ID        int32
	CreatorId int32
}

func (s *Store) CreateMemoHook(ctx context.Context, create *MemoHook) (*MemoHook, error) {
	stmt := `
		insert into memo_hook (
			name,
			url,
			creator_id
		) values (?, ?, ?)
		RETURNING name, url, creator_id
	`
	if err := s.db.QueryRowContext(ctx, stmt, create.Name, create.Url, create.CreatorID).Scan(
		&create.Name,
		&create.Url,
		&create.CreatorID,
	); err != nil {
		return nil, err
	} else {
		memoHook := create
		return memoHook, nil
	}
}

func (s *Store) DeleteMemoHook(ctx context.Context, delete *DeleteMemoHook) error {
	stmt := `DELETE FROM memo_hook WHERE id = ? and creator_id = ?`
	result, err := s.db.ExecContext(ctx, stmt, delete.ID, delete.CreatorId)
	if err != nil {
		return err
	}
	if _, err := result.RowsAffected(); err != nil {
		return err
	}
	if err := s.Vacuum(ctx); err != nil {
		// Prevent linter warning.
		return err
	}
	return nil
}

func (s *Store) FindMemoHooks(ctx context.Context, find *MemoHook) (hooks []MemoHook, err error) {

	where := []string{" 1=1"}
	params := []any{}

	if find != nil {
		if find.CreatorID != 0 {
			where = append(where, "creator_id = ?")
			params = append(params, find.CreatorID)
		}
	}

	query := `
		select id, name, url, creator_id from memo_hook where  
	` + strings.Join(where, " and ")

	rows, err := s.db.QueryContext(ctx, query, params...)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	list := make([]MemoHook, 0)
	for rows.Next() {
		var hook MemoHook
		if err := rows.Scan(
			&hook.ID,
			&hook.Name,
			&hook.Url,
			&hook.CreatorID,
		); err != nil {
			return nil, err
		}
		list = append(list, hook)
	}

	if err := rows.Err(); err != nil {
		return nil, err
	}

	return list, nil
}
