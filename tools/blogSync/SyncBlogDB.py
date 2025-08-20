import argparse
import os
import re
import subprocess
import sys
import termcolor


def run(cmd, check=True, capture=False):
    """
    check: whether to throw an error if the command fails (default: True)
    capture: whether to capture and return the output (default: False)
    """
    if capture:
        return subprocess.run(cmd, shell=True, check=check, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True).stdout.strip()
    else:
        subprocess.run(cmd, shell=True, check=check)

def current_branch():
    return run("git rev-parse --abbrev-ref HEAD", capture=True)

def has_changes_in(pathspec:str):
    out = run(f'git status --porcelain -- "{pathspec}"', capture=True)
    return bool(out.strip())

def ensure_clean_index():
    """
    Allow uncommitted changes, since we will do a partial stash.
    but abort if there are merge conflicts
    """
    conflicted = run('git ls-files -u', capture=True)
    if conflicted.strip():
        print(termcolor.colored("There are unresolved conflicts. Please resolve them before proceeding.", "red"))
        sys.exit(1)

def get_latest_stash_ref():
    out = run("git stash list", capture=True)
    if not out.strip():
        return None
    # get stash@{0}
    first = out.splitlines()[0]
    m = re.match(r'^(stash@\{\d+\})', first)
    return m.group(1) if m else None

# =================================================================================

PROJECT_ROOT:str = os.path.abspath(run("git rev-parse --show-toplevel", capture=True))
BLOG_DB_PATH:str = os.path.join(PROJECT_ROOT, "public", "blogDB")

def main():
    parser = argparse.ArgumentParser(description="Sync blog changes to main and back to current feature branch.")
    parser.add_argument("--no-sync-feature", action="store_true", help="do not merge back to the original feature branch")
    args = parser.parse_args()

    os.chdir(PROJECT_ROOT)

    ensure_clean_index()

    start_branch = current_branch()
    print(f"Current branch: {start_branch}")

    try:
        run("git remote get-url origin", check=True)
    except subprocess.CalledProcessError:
        print(termcolor.colored("No remote repository found. Please set up a remote repository.", "red"))
        sys.exit(1)

    # check blogDB has changes in current branch
    changed_blogDB = has_changes_in(BLOG_DB_PATH)

    # if blogDB has change in current branch, stash changes
    partial_stash_ref = None
    if start_branch != "main" and changed_blogDB:
        print("Detected changes in blogDB. Stashing changes...")
        partial_stash_ref = run(f"git stash push -u -m 'sync_blog partial stash for {BLOG_DB_PATH}'", capture=True)
        partial_stash_ref = get_latest_stash_ref()
        if not partial_stash_ref:
            print(termcolor.colored("Failed to create partial stash. Aborting.", "red"))
            sys.exit(1)

    # change to main branch and pull
    print("Switching to main branch")
    run("git switch main")
    print("Pulling latest changes from main branch")
    run("git pull --ff-only origin main")

    if partial_stash_ref:
        print("Applying partial stash to main branch")
        try:
            run(f"git stash apply --index {partial_stash_ref}")
        except subprocess.CalledProcessError:
            print(termcolor.colored("Failed to apply partial stash with --index. Trying stash apply", "yellow"))
            run(f"git stash apply {partial_stash_ref}")

    # avoid only apply but not add
    run(f'git add "{BLOG_DB_PATH}"')

    # if main has no change, just commit
    has_staged = subprocess.run('git diff --cached --quiet', shell=True).returncode != 0
    if not has_staged:
        print("No changes to commit in main branch.")
        if partial_stash_ref:
            run(f"git stash drop {partial_stash_ref}")
        if start_branch != "main" and not args.no_sync_feature:
            print(termcolor.colored("Merging changes back to the original feature branch", "yellow"))
            run(f"git switch {start_branch}")
        print("Done.")
        return
    else:
        print("update blog to github page")
        run(f'git commit -m "Update blogDB"')
        run("git push origin main")

    if not args.no_sync_feature and start_branch != "main":
        print(termcolor.colored("Merging changes back to the original feature branch", "yellow"))
        run(f"git switch {start_branch}")
        try:
            run(f"git pull --ff-only")
        except subprocess.CalledProcessError:
            print(termcolor.colored("Failed to fast-forward merge. Please resolve conflicts manually.", "red"))
            sys.exit(1)
        
        ff_ok = (subprocess.run("git merge --ff-only origin/main", shell=True).returncode == 0)
        if not ff_ok:
            print(termcolor.colored("Fast-forward merge failed. Using default merge", "yellow"))
            run("git merge origin/main")
        print("Done.")
        


    return

if __name__ == "__main__":
    main()
