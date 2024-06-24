#!/usr/bin/env python3
""" Pagination class"""
import csv
import math
from typing import List, Dict, Any
index_range = __import__('0-simple_helper_function').index_range


class Server:
    """Server class to paginate a database of popular baby names.
    """
    DATA_FILE = "Popular_Baby_Names.csv"

    def __init__(self):
        """ Initialization"""
        self.__dataset = None

    def dataset(self) -> List[List]:
        """Cached dataset
        """
        if self.__dataset is None:
            with open(self.DATA_FILE) as f:
                reader = csv.reader(f)
                dataset = [row for row in reader]
            self.__dataset = dataset[1:]

        return self.__dataset

    def get_page(self, page: int = 1, page_size: int = 10) -> List[List]:
        """ Method returns a list of data in a page"""
        assert type(page) is int and type(page_size) is int
        assert page > 0 and page_size > 0
        start, end = index_range(page, page_size)
        last: int = len(self.dataset()) - 1
        if start > last:
            return []
        if end > last:
            end = last + 1
        my_page = []
        for index in range(start, end):
            my_page.append(self.dataset()[index])
        return my_page

    def get_hyper(self, page: int = 1, page_size: int = 10) -> Dict[str, Any]:
        """ Returns the hypermedia data of a page"""
        data = self.get_page(page, page_size)
        true_page_size = len(data)
        total_pages = (len(self.dataset()) + page_size - 1) // page_size
        next_page = page + 1 if page < total_pages else None
        prev_page = page - 1 if page > 1 else None
        hypermedia = {
            "page_size": true_page_size,
            "page": page,
            "data": data,
            "next_page": next_page,
            "prev_page": prev_page,
            "total_pages": total_pages
        }
        return hypermedia
