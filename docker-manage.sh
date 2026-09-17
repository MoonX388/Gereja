#!/bin/bash

# Gereja Digital Docker Management Script
# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Functions
print_header() {
    echo -e "${BLUE}================================${NC}"
    echo -e "${BLUE}$1${NC}"
    echo -e "${BLUE}================================${NC}"
}

print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

print_info() {
    echo -e "${YELLOW}ℹ $1${NC}"
}

# Main menu
show_menu() {
    print_header "Gereja Digital Docker Manager"
    echo ""
    echo "Select an option:"
    echo "1. Start production environment"
    echo "2. Start development environment"
    echo "3. Stop all containers"
    echo "4. View logs"
    echo "5. Build images"
    echo "6. Clean up containers & volumes"
    echo "7. Database backup"
    echo "8. Database restore"
    echo "9. Shell into backend"
    echo "10. Shell into frontend"
    echo "11. Show container status"
    echo "0. Exit"
    echo ""
    read -p "Enter your choice [0-11]: " choice
}

# Start production
start_production() {
    print_header "Starting Production Environment"
    
    if [ ! -f .env ]; then
        print_error ".env file not found"
        print_info "Creating .env from .env.example..."
        cp .env.example .env
        print_info "Edit .env file with your configuration"
    fi
    
    docker-compose up -d
    
    if [ $? -eq 0 ]; then
        print_success "Production environment started"
        echo ""
        print_info "Services:"
        echo "  Frontend: http://localhost:3000"
        echo "  Backend: http://localhost:3001"
        echo "  Nginx: http://localhost (reverse proxy)"
    else
        print_error "Failed to start production environment"
    fi
}

# Start development
start_development() {
    print_header "Starting Development Environment"
    
    docker-compose -f docker-compose.dev.yml up -d
    
    if [ $? -eq 0 ]; then
        print_success "Development environment started"
        echo ""
        print_info "Services (with hot-reload):"
        echo "  Frontend: http://localhost:3000"
        echo "  Backend: http://localhost:3001"
        echo "  Backend Debug: 0.0.0.0:9229"
    else
        print_error "Failed to start development environment"
    fi
}

# Stop containers
stop_containers() {
    print_header "Stopping Containers"
    
    echo "Stop production environment? (y/n)"
    read -p "Enter choice: " prod_choice
    if [ "$prod_choice" = "y" ]; then
        docker-compose down
        print_success "Production environment stopped"
    fi
    
    echo "Stop development environment? (y/n)"
    read -p "Enter choice: " dev_choice
    if [ "$dev_choice" = "y" ]; then
        docker-compose -f docker-compose.dev.yml down
        print_success "Development environment stopped"
    fi
}

# View logs
view_logs() {
    print_header "View Logs"
    echo "Select service:"
    echo "1. Backend (production)"
    echo "2. Frontend (production)"
    echo "3. Backend (development)"
    echo "4. Frontend (development)"
    echo "5. All (production)"
    echo "6. All (development)"
    read -p "Enter choice: " log_choice
    
    case $log_choice in
        1) docker-compose logs -f backend ;;
        2) docker-compose logs -f frontend ;;
        3) docker-compose -f docker-compose.dev.yml logs -f backend ;;
        4) docker-compose -f docker-compose.dev.yml logs -f frontend ;;
        5) docker-compose logs -f ;;
        6) docker-compose -f docker-compose.dev.yml logs -f ;;
        *) print_error "Invalid choice" ;;
    esac
}

# Build images
build_images() {
    print_header "Building Docker Images"
    
    docker-compose build
    
    if [ $? -eq 0 ]; then
        print_success "Images built successfully"
    else
        print_error "Failed to build images"
    fi
}

# Clean up
cleanup() {
    print_header "Cleanup"
    echo "This will remove:"
    echo "  - Stopped containers"
    echo "  - Unused volumes"
    echo "  - Dangling images"
    echo ""
    read -p "Continue? (y/n): " cleanup_choice
    
    if [ "$cleanup_choice" = "y" ]; then
        docker-compose down -v
        docker system prune -f
        print_success "Cleanup completed"
    else
        print_info "Cleanup cancelled"
    fi
}

# Database backup
backup_database() {
    print_header "Database Backup"
    
    BACKUP_DIR="./backups"
    mkdir -p $BACKUP_DIR
    
    BACKUP_FILE="$BACKUP_DIR/database-$(date +%Y%m%d-%H%M%S).sqlite"
    
    docker cp gereja-backend:/app/database.sqlite "$BACKUP_FILE"
    
    if [ $? -eq 0 ]; then
        print_success "Database backed up to: $BACKUP_FILE"
    else
        print_error "Failed to backup database"
    fi
}

# Database restore
restore_database() {
    print_header "Database Restore"
    
    BACKUP_DIR="./backups"
    
    if [ ! -d "$BACKUP_DIR" ]; then
        print_error "No backups found"
        return
    fi
    
    echo "Available backups:"
    ls -1 $BACKUP_DIR
    echo ""
    read -p "Enter backup filename: " backup_file
    
    if [ -f "$BACKUP_DIR/$backup_file" ]; then
        docker cp "$BACKUP_DIR/$backup_file" gereja-backend:/app/database.sqlite
        print_success "Database restored from: $backup_file"
    else
        print_error "Backup file not found"
    fi
}

# Shell into backend
shell_backend() {
    print_header "Shell into Backend"
    docker exec -it gereja-backend sh
}

# Shell into frontend
shell_frontend() {
    print_header "Shell into Frontend"
    docker exec -it gereja-frontend sh
}

# Container status
container_status() {
    print_header "Container Status"
    docker ps -a --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
}

# Main loop
while true; do
    show_menu
    
    case $choice in
        1) start_production ;;
        2) start_development ;;
        3) stop_containers ;;
        4) view_logs ;;
        5) build_images ;;
        6) cleanup ;;
        7) backup_database ;;
        8) restore_database ;;
        9) shell_backend ;;
        10) shell_frontend ;;
        11) container_status ;;
        0) print_info "Goodbye!"; exit 0 ;;
        *) print_error "Invalid choice" ;;
    esac
    
    echo ""
    read -p "Press Enter to continue..."
done
